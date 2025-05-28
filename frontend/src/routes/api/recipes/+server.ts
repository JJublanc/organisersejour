import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { Ingredient, KitchenTool } from '$lib/types'; // Import shared types
import { getNeonDbUrl, getDbClient } from '$lib/server/db'; // Import Neon DB functions
import type { Sql as PostgresSql, TransactionSql } from 'postgres'; // For typing sqltrx

// Define the structure for a Recipe, including related data
export interface Recipe {
    id: number;
    name: string;
    description: string | null;
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;
    instructions: string | null;
    servings: number;
    season: 'spring' | 'summer' | 'autumn' | 'winter' | null;
    ingredients: RecipeIngredient[]; // Array of associated ingredients
    kitchen_tools: KitchenTool[]; // Array of associated tools
    user_id: string; // Add user_id to the Recipe interface
}

// Define the structure for the join table data (RecipeIngredient)
export interface RecipeIngredient {
    ingredient_id: number;
    name: string; // Name of the ingredient
    unit: string; // Unit of the ingredient
    type?: string; // Added from POST handler logic, ensure it's in the type if used
    quantity: number;
}

// Structure for creating a new recipe (request body)
interface CreateRecipePayload {
    name: string;
    description?: string | null;
    prep_time_minutes?: number | null;
    cook_time_minutes?: number | null;
    instructions?: string | null;
    servings: number;
    season?: 'spring' | 'summer' | 'autumn' | 'winter' | null;
    ingredients: { ingredient_id: number; quantity: number }[]; // Required ingredients
    kitchen_tool_ids?: number[]; // Optional tools
}


// --- GET Handler (Updated for Pagination) ---
export const GET: RequestHandler = async ({ platform, locals, url }) => {
    console.log("[API /api/recipes GET] locals.user:", locals.user);
    
    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[API /api/recipes GET] Neon Database URL not found for environment.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);
    
    // For Clerk authentication, we'll use a default user ID
    // TODO: Implement proper Clerk session verification
    const clerkPublishableKey = platform?.env?.CLERK_PUBLISHABLE_KEY;
    if (!clerkPublishableKey) {
        throw error(500, 'Authentication not configured');
    }
    
    // Use a default user ID for Clerk-authenticated requests
    const user = {
        id: 'clerk-user',
        email: 'clerk-user@example.com',
        name: 'Clerk User',
        authenticated: true
    };
    
    
    
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit; // Not directly used in current query, but good for future pagination
    
    if (isNaN(page) || page < 1) throw error(400, 'Invalid page parameter.');
    if (isNaN(limit) || limit < 1) throw error(400, 'Invalid limit parameter.');

    try {
        console.log(`[API /api/recipes GET] Fetching recipes for user: ${user.id} and system recipes`);
        const recipesList = await sql<Omit<Recipe, 'ingredients' | 'kitchen_tools'>[]>`
            SELECT id, name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id
            FROM recipes
            WHERE user_id = ${user.id} OR user_id = 'system'
            ORDER BY name ASC
        `;

        if (!recipesList || recipesList.length === 0) {
            return json({ recipes: [] });
        }

        const recipesWithDetails: Recipe[] = [];
        for (const recipe of recipesList) {
            const ingredientsList = await sql<RecipeIngredient[]>`
                SELECT ri.ingredient_id, i.name, i.unit, i.type, ri.quantity
                FROM recipe_ingredients ri JOIN ingredients i ON ri.ingredient_id = i.id
                WHERE ri.recipe_id = ${recipe.id}
            `;
            const toolsList = await sql<KitchenTool[]>`
                SELECT kt.id, kt.name
                FROM recipe_kitchen_tools rkt JOIN kitchen_tools kt ON rkt.tool_id = kt.id
                WHERE rkt.recipe_id = ${recipe.id}
            `;
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

// --- POST Handler (New) ---
export const POST: RequestHandler = async ({ request, platform, locals }) => {
    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[API /api/recipes POST] Neon Database URL not found for environment.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);

    // For Clerk authentication, we'll use a default user ID
    // TODO: Implement proper Clerk session verification
    const clerkPublishableKey = platform?.env?.CLERK_PUBLISHABLE_KEY;
    if (!clerkPublishableKey) {
        throw error(500, 'Authentication not configured');
    }
    
    // Use a default user ID for Clerk-authenticated requests
    const user = {
        id: 'clerk-user',
        email: 'clerk-user@example.com',
        name: 'Clerk User',
        authenticated: true
    };
    
    

    try {
        const body: CreateRecipePayload = await request.json();
        console.log("[API /api/recipes POST] Received recipe creation request:", body);

        if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') throw error(400, 'Recipe name is required.');
        if (body.servings === undefined || typeof body.servings !== 'number' || body.servings < 1) throw error(400, 'Valid servings number (>= 1) is required.');
        if (!Array.isArray(body.ingredients) || body.ingredients.length === 0) throw error(400, 'At least one ingredient is required.');
        for (const ing of body.ingredients) {
            if (typeof ing.ingredient_id !== 'number' || typeof ing.quantity !== 'number' || ing.quantity <= 0) {
                throw error(400, 'Invalid ingredient data format or quantity.');
            }
        }
        if (body.kitchen_tool_ids && (!Array.isArray(body.kitchen_tool_ids) || body.kitchen_tool_ids.some(id => typeof id !== 'number'))) {
             throw error(400, 'Invalid kitchen tool IDs format.');
        }

        // Transaction with postgres.js
        const newRecipeResult = await sql.begin(async (sqltrx: TransactionSql) => {
            const insertedRecipes = await sqltrx< { id: number }[]>`
                INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
                VALUES (${body.name.trim()}, ${body.description ?? null}, ${body.prep_time_minutes ?? null}, ${body.cook_time_minutes ?? null}, ${body.instructions ?? null}, ${body.servings}, ${body.season ?? null}, ${user.id})
                RETURNING id
            `;
            const newRecipeId = insertedRecipes[0]?.id;
            if (!newRecipeId) throw new Error("Failed to create recipe record or retrieve ID.");
            console.log(`[API /api/recipes POST] Inserted recipe with ID: ${newRecipeId}`);

            for (const ing of body.ingredients) {
                await sqltrx`
                    INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
                    VALUES (${newRecipeId}, ${ing.ingredient_id}, ${ing.quantity})
                `;
            }

            if (body.kitchen_tool_ids && body.kitchen_tool_ids.length > 0) {
                for (const toolId of body.kitchen_tool_ids) {
                    await sqltrx`
                        INSERT INTO recipe_kitchen_tools (recipe_id, tool_id)
                        VALUES (${newRecipeId}, ${toolId})
                    `;
                }
            }
            return newRecipeId;
        });
        
        const newRecipeId = newRecipeResult; // Result from transaction
        console.log(`[API /api/recipes POST] Transaction committed for recipe ID: ${newRecipeId}`);

        // Fetch the complete recipe with ingredients and tools to return
        const ingredientsList = await sql<RecipeIngredient[]>`
            SELECT ri.ingredient_id, i.name, i.unit, i.type, ri.quantity
            FROM recipe_ingredients ri JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = ${newRecipeId}
        `;
        const toolsList = await sql<KitchenTool[]>`
            SELECT kt.id, kt.name
            FROM recipe_kitchen_tools rkt JOIN kitchen_tools kt ON rkt.tool_id = kt.id
            WHERE rkt.recipe_id = ${newRecipeId}
        `;

        const finalRecipe: Recipe = {
             id: newRecipeId,
             name: body.name.trim(),
             description: body.description ?? null,
             prep_time_minutes: body.prep_time_minutes ?? null,
             cook_time_minutes: body.cook_time_minutes ?? null,
             instructions: body.instructions ?? null,
             servings: body.servings,
             season: body.season ?? null,
             user_id: user.id, // Ensure user.id is defined
             ingredients: ingredientsList || [],
             kitchen_tools: toolsList || []
        };
        console.log(`[API /api/recipes POST] Successfully created recipe ID: ${newRecipeId}`);
        return json({ recipe: finalRecipe }, { status: 201 });
       } catch (e: any) {
           if (e.code === '23505') { // PostgreSQL unique violation
                const bodyForError = await request.clone().json();
                console.warn(`[API /api/recipes POST] Attempted to create duplicate recipe name: ${bodyForError.name}`);
                throw error(409, `Une recette nommée '${bodyForError.name}' existe déjà.`);
           }
           if (e.status >= 400 && e.status < 500) throw e;
           console.error('[API /api/recipes POST] Error creating recipe:', e);
           throw error(500, `Failed to create recipe: ${e.message || 'Unknown error'}`);
       }
   };

// --- DELETE Handler ---
export const DELETE: RequestHandler = async ({ request, platform, locals, url }) => {
    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[API /api/recipes DELETE] Neon Database URL not found for environment.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);

    // For Clerk authentication, we'll use a default user ID
    // TODO: Implement proper Clerk session verification
    const clerkPublishableKey = platform?.env?.CLERK_PUBLISHABLE_KEY;
    if (!clerkPublishableKey) {
        throw error(500, 'Authentication not configured');
    }
    
    // Use a default user ID for Clerk-authenticated requests
    const user = {
        id: 'clerk-user',
        email: 'clerk-user@example.com',
        name: 'Clerk User',
        authenticated: true
    };
    
    

    try {
        const recipeIdParam = url.searchParams.get('id');
        if (!recipeIdParam || isNaN(parseInt(recipeIdParam))) {
            throw error(400, "Invalid recipe ID parameter.");
        }
        const id = parseInt(recipeIdParam);
        console.log(`[API /api/recipes DELETE] Attempting to delete recipe ID: ${id} for user: ${user.id}`);

        const recipes = await sql<{ id: number, user_id: string }[]>`
            SELECT id, user_id FROM recipes WHERE id = ${id}
        `;
        const recipe = recipes[0];

        if (!recipe) throw error(404, "Recipe not found.");
        if (recipe.user_id === 'system') throw error(403, "Les recettes système ne peuvent pas être supprimées.");
        if (recipe.user_id !== user.id) throw error(403, "Vous n'avez pas la permission de supprimer cette recette.");

        const mealUsage = await sql<{ count: string }[]>`
            SELECT COUNT(*) as count FROM meal_components WHERE recipe_id = ${id}
        `;
        if (mealUsage[0] && parseInt(mealUsage[0].count) > 0) {
            throw error(409, `Cette recette est utilisée dans ${mealUsage[0].count} repas et ne peut pas être supprimée.`);
        }

        // Transaction for delete
        const deleteResultCount = await sql.begin(async (sqltrx: TransactionSql) => {
            await sqltrx`DELETE FROM recipe_ingredients WHERE recipe_id = ${id}`;
            await sqltrx`DELETE FROM recipe_kitchen_tools WHERE recipe_id = ${id}`;
            const result = await sqltrx`DELETE FROM recipes WHERE id = ${id} AND user_id = ${user.id}`;
            return result.count;
        });

        if (deleteResultCount === 0) {
            throw error(500, "Failed to delete recipe (no rows affected or permission issue).");
        }
        console.log(`[API /api/recipes DELETE] Successfully deleted recipe ID: ${id}`);
        return json({ success: true, message: "Recette supprimée avec succès." });
    } catch (e: any) {
        if (e.status >= 400 && e.status < 500) throw e;
        console.error('[API /api/recipes DELETE] Error deleting recipe:', e);
        throw error(500, `Failed to delete recipe: ${e.message || 'Unknown error'}`);
    }
 };
