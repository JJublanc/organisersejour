import { error } from '@sveltejs/kit'; // Remove parent import
import type { PageServerLoad } from './$types';
import type { Recipe } from '$lib/types';
import type { User } from '$lib/auth'; // Import User type

export const load: PageServerLoad = async ({ platform, locals, parent }) => { // Add parent to destructured arguments
    console.log("[Page /recipes] locals.user:", locals.user); // Log locals.user
    
    // Use DB_PREPROD in preprod, otherwise use DB
    const db = platform?.env?.ENVIRONMENT === 'preprod' ? platform?.env?.DB_PREPROD : platform?.env?.DB;
    
    // Get user from parent layout load data
    const parentData = await parent();
    let user: User | null = parentData.user as User | null; // Change const to let and cast

    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';

    // If auth is enabled, ensure user is authenticated
    if (authEnabled && (!user || !user.authenticated)) { // Check if user is null or not authenticated
        throw error(401, 'Authentication required');
    }
    
    // Pour le développement, utiliser un utilisateur par défaut si l'authentification est désactivée
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user2', name: 'Development User', authenticated: true };
    }

    if (!db) {
        console.error("[Page /recipes] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        // Vérifier que user n'est pas null
        if (!user) {
            throw error(401, 'User not authenticated');
        }
        
        console.log(`[Page /recipes] Fetching recipes for user: ${user.id} and system recipes`);

        // Fetch user's recipes and system recipes
        const recipesStmt = db.prepare(`
            SELECT
                id,
                COALESCE(french_name, name) as name,
                description,
                prep_time_minutes,
                cook_time_minutes,
                instructions,
                servings,
                season,
                user_id
            FROM recipes
            WHERE user_id = ? OR user_id = ?
            ORDER BY name ASC
        `);
        const { results: recipesList } = await recipesStmt.bind(user.id, 'system').all<Omit<Recipe, 'ingredients' | 'kitchen_tools'>>();

        // Prepare statements for ingredients and tools
        const ingredientsStmt = db.prepare(`
            SELECT ri.ingredient_id, COALESCE(i.french_name, i.name) as name, i.unit, i.type, ri.quantity
            FROM recipe_ingredients ri JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = ?
        `);
        
        const toolsStmt = db.prepare(`
            SELECT kt.id, COALESCE(kt.french_name, kt.name) as name
            FROM recipe_kitchen_tools rkt JOIN kitchen_tools kt ON rkt.tool_id = kt.id
            WHERE rkt.recipe_id = ?
        `);

        // For each recipe, fetch its ingredients and tools
        const recipesWithDetails: Recipe[] = [];
        
        for (const recipe of recipesList) {
            const { results: ingredientsList } = await ingredientsStmt.bind(recipe.id).all<{
                ingredient_id: number;
                name: string;
                unit: string;
                type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre';
                quantity: number;
            }>();
            
            const { results: toolsList } = await toolsStmt.bind(recipe.id).all<{
                id: number;
                name: string;
            }>();
            
            recipesWithDetails.push({
                ...recipe,
                ingredients: ingredientsList || [],
                kitchen_tools: toolsList || [],
            });
        }

        console.log(`[Page /recipes] Successfully fetched ${recipesWithDetails.length} recipes.`);
        return { recipes: recipesWithDetails };

    } catch (e: any) {
        console.error('[Page /recipes] Error fetching recipes:', e);
        throw error(500, `Failed to fetch recipes: ${e.message || 'Unknown error'}`);
    }
};