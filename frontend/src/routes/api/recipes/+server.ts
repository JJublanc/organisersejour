import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Ingredient, KitchenTool } from '$lib/types'; // Assuming types will be defined here

// Define the structure for a Recipe, including related data
export interface Recipe {
    id: number;
    name: string;
    description: string | null;
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;
    instructions: string | null;
    servings: number;
    ingredients: RecipeIngredient[]; // Array of associated ingredients
    kitchen_tools: KitchenTool[]; // Array of associated tools
}

// Define the structure for the join table data (RecipeIngredient)
export interface RecipeIngredient {
    ingredient_id: number;
    name: string; // Name of the ingredient
    unit: string; // Unit of the ingredient
    quantity: number;
}

// Define the structure for KitchenTool (if not already defined in $lib/types)
// export interface KitchenTool {
//     id: number;
//     name: string;
// }

export const GET: RequestHandler = async ({ platform }) => {
    const db = platform?.env?.DB;
    if (!db) {
        console.error("[API /api/recipes GET] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        console.log("[API /api/recipes GET] Fetching all recipes...");

        // 1. Fetch all recipes
        const recipesStmt = db.prepare('SELECT * FROM recipes');
        const { results: recipesList } = await recipesStmt.all<Omit<Recipe, 'ingredients' | 'kitchen_tools'>>();

        if (!recipesList) {
            console.log("[API /api/recipes GET] No recipes found.");
            return json({ recipes: [] });
        }

        // 2. For each recipe, fetch its ingredients and tools
        const recipesWithDetails: Recipe[] = [];
        for (const recipe of recipesList) {
            // Fetch ingredients for the current recipe
            const ingredientsStmt = db.prepare(`
                SELECT
                    ri.ingredient_id,
                    i.name,
                    i.unit,
                    ri.quantity
                FROM recipe_ingredients ri
                JOIN ingredients i ON ri.ingredient_id = i.id
                WHERE ri.recipe_id = ?
            `);
            const { results: ingredientsList } = await ingredientsStmt.bind(recipe.id).all<RecipeIngredient>();

            // Fetch kitchen tools for the current recipe
            const toolsStmt = db.prepare(`
                SELECT
                    kt.id,
                    kt.name
                FROM recipe_kitchen_tools rkt
                JOIN kitchen_tools kt ON rkt.tool_id = kt.id
                WHERE rkt.recipe_id = ?
            `);
            const { results: toolsList } = await toolsStmt.bind(recipe.id).all<KitchenTool>();

            recipesWithDetails.push({
                ...recipe,
                ingredients: ingredientsList || [],
                kitchen_tools: toolsList || [],
            });
        }

        console.log(`[API /api/recipes GET] Successfully fetched ${recipesWithDetails.length} recipes with details.`);
        return json({ recipes: recipesWithDetails });

    } catch (e: any) {
        console.error('[API /api/recipes GET] Error fetching recipes:', e);
        throw error(500, `Failed to fetch recipes: ${e.message || 'Unknown error'}`);
    }
};