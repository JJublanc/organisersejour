import { error, type ServerLoad } from '@sveltejs/kit';
import type { Recipe, RecipeIngredient, KitchenTool } from '$lib/types';
import type { User } from '$lib/auth';
import { getNeonDbUrl, getDbClient } from '$lib/server/db';

export const load: ServerLoad = async ({ platform, locals, parent }) => {
    console.log("[Page /recipes] locals.user:", locals.user);

    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[Page /recipes] Neon Database URL not found.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);

    const parentData = await parent();
    let user: User | null = parentData.user as User | null;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';

    if (authEnabled && (!user || !user.authenticated)) {
        throw error(401, 'Authentication required');
    }
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user) { // Should be caught by authEnabled check or default user assignment
        throw error(401, 'User context not available');
    }

    try {
        console.log(`[Page /recipes] Fetching recipes for user: ${user.id} and system recipes`);

        const recipesList = await sql<Omit<Recipe, 'ingredients' | 'kitchen_tools'>[]>`
            SELECT
                id, name, description,
                prep_time_minutes, cook_time_minutes, instructions,
                servings, season, user_id
            FROM recipes
            WHERE user_id = ${user.id} OR user_id = 'system'
            ORDER BY name ASC
        `;

        if (!recipesList || recipesList.length === 0) {
            console.log("[Page /recipes] No recipes found.");
            return { recipes: [] };
        }

        const recipeIds = recipesList.map(recipe => recipe.id);

        // Fetch all ingredients for all fetched recipes
        // postgres.js can handle array directly in IN clause with sql() helper or by spreading
        const allIngredientsList = await sql<{
            recipe_id: number;
            ingredient_id: number;
            name: string;
            unit: string;
            type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre';
            quantity: number;
        }[]>`
            SELECT ri.recipe_id, ri.ingredient_id, i.name, i.unit, i.type, ri.quantity
            FROM recipe_ingredients ri JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id IN ${sql(recipeIds)}
        `;

        // Fetch all kitchen tools for all fetched recipes
        const allToolsList = await sql<{
            recipe_id: number;
            id: number;
            name: string;
        }[]>`
            SELECT rkt.recipe_id, kt.id, kt.name
            FROM recipe_kitchen_tools rkt JOIN kitchen_tools kt ON rkt.tool_id = kt.id
            WHERE rkt.recipe_id IN ${sql(recipeIds)}
        `;

        const ingredientsMap = new Map<number, RecipeIngredient[]>();
        allIngredientsList?.forEach(item => {
            if (!ingredientsMap.has(item.recipe_id)) {
                ingredientsMap.set(item.recipe_id, []);
            }
            ingredientsMap.get(item.recipe_id)?.push({
                ingredient_id: item.ingredient_id,
                name: item.name,
                unit: item.unit,
                quantity: item.quantity,
                type: item.type,
            });
        });

        const toolsMap = new Map<number, KitchenTool[]>();
        allToolsList?.forEach(item => {
            if (!toolsMap.has(item.recipe_id)) {
                toolsMap.set(item.recipe_id, []);
            }
            toolsMap.get(item.recipe_id)?.push({
                id: item.id,
                name: item.name,
            });
        });

        const recipesWithDetails: Recipe[] = recipesList.map(recipe => ({
            ...recipe,
            ingredients: ingredientsMap.get(recipe.id) || [],
            kitchen_tools: toolsMap.get(recipe.id) || [],
        }));

        console.log(`[Page /recipes] Successfully fetched ${recipesWithDetails.length} recipes with details.`);
        return { recipes: recipesWithDetails };

    } catch (e: any) {
        console.error('[Page /recipes] Error fetching recipes:', e);
        // Check if it's a PostgresError and if code is '42P01' (undefined_table)
        if (e.code === '42P01') {
             console.error(`[Page /recipes] Table not found. This might indicate migrations haven't run on Neon for the current environment.`);
             throw error(500, `Database table not found. Please ensure migrations are up to date. Error: ${e.message}`);
        }
        throw error(500, `Failed to fetch recipes: ${e.message || 'Unknown error'}`);
    }
};