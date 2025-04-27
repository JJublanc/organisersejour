import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { Ingredient, KitchenTool } from '$lib/types'; // Import shared types
import type { D1PreparedStatement } from '@cloudflare/workers-types';

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

// Structure for creating a new recipe (request body)
interface CreateRecipePayload {
    name: string;
    description?: string | null;
    prep_time_minutes?: number | null;
    cook_time_minutes?: number | null;
    instructions?: string | null;
    servings: number;
    ingredients: { ingredient_id: number; quantity: number }[]; // Required ingredients
    kitchen_tool_ids?: number[]; // Optional tools
}


// --- GET Handler (Updated) ---
export const GET: RequestHandler = async ({ platform, locals }) => {
    const db = platform?.env?.DB;
    
    // --- Authentication ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    console.log(`[API /api/recipes GET] Auth enabled: ${authEnabled}, user: ${user ? JSON.stringify(user) : 'undefined'}`);
    
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
        console.log(`[API /api/recipes GET] Created default user: ${JSON.stringify(user)}`);
    }
    if (!user?.authenticated) {
        console.warn("[API /api/recipes GET] Unauthenticated user attempted to fetch recipes.");
        throw error(401, 'Authentication required to access recipes.');
    }
    // --- End Authentication ---
    
    if (!db) {
        console.error("[API /api/recipes GET] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        console.log(`[API /api/recipes GET] Fetching recipes for user: ${user.id}`);

        // 1. Fetch user's recipes
        const recipesStmt = db.prepare('SELECT * FROM recipes WHERE user_id = ?');
        const { results: recipesList } = await recipesStmt.bind(user.id).all<Omit<Recipe, 'ingredients' | 'kitchen_tools'>>();

        if (!recipesList) {
            console.log("[API /api/recipes GET] No recipes found.");
            return json({ recipes: [] });
        }

        // 2. For each recipe, fetch its ingredients and tools
        const recipesWithDetails: Recipe[] = [];
        // Prepare statements outside loop
        const ingredientsStmt = db.prepare(`
            SELECT ri.ingredient_id, i.name, i.unit, ri.quantity
            FROM recipe_ingredients ri JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = ?
        `);
        const toolsStmt = db.prepare(`
            SELECT kt.id, kt.name
            FROM recipe_kitchen_tools rkt JOIN kitchen_tools kt ON rkt.tool_id = kt.id
            WHERE rkt.recipe_id = ?
        `);

        for (const recipe of recipesList) {
            const { results: ingredientsList } = await ingredientsStmt.bind(recipe.id).all<RecipeIngredient>();
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

// --- POST Handler (New) ---
export const POST: RequestHandler = async ({ request, platform, locals }) => {
    const db = platform?.env?.DB;

    // --- Authentication (Optional but recommended for recipe creation) ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    console.log(`[API /api/recipes POST] Auth enabled: ${authEnabled}, user: ${user ? JSON.stringify(user) : 'undefined'}`);
    
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
        console.log(`[API /api/recipes POST] Created default user: ${JSON.stringify(user)}`);
    }
    if (!user?.authenticated) {
         // Decide if unauthenticated users can create recipes. For now, let's restrict it.
         console.warn("[API /api/recipes POST] Unauthenticated user attempted recipe creation.");
         throw error(401, 'Authentication required to create recipes.');
    }
    // --- End Authentication ---


    if (!db) {
        console.error("[API /api/recipes POST] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        const body: CreateRecipePayload = await request.json();
        console.log("[API /api/recipes POST] Received recipe creation request:", body);

        // --- Validation ---
        if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
            throw error(400, 'Recipe name is required.');
        }
        if (body.servings === undefined || typeof body.servings !== 'number' || body.servings < 1) {
            throw error(400, 'Valid servings number (>= 1) is required.');
        }
        if (!Array.isArray(body.ingredients) || body.ingredients.length === 0) {
            throw error(400, 'At least one ingredient is required.');
        }
        // Basic validation for ingredients array structure
        for (const ing of body.ingredients) {
            if (typeof ing.ingredient_id !== 'number' || typeof ing.quantity !== 'number' || ing.quantity <= 0) {
                throw error(400, 'Invalid ingredient data format or quantity.');
            }
        }
        // Basic validation for tools array structure (if provided)
        if (body.kitchen_tool_ids && (!Array.isArray(body.kitchen_tool_ids) || body.kitchen_tool_ids.some(id => typeof id !== 'number'))) {
             throw error(400, 'Invalid kitchen tool IDs format.');
        }
        // --- End Validation ---


        // --- Database Insertion (Transaction) ---
        const batchActions: D1PreparedStatement[] = [];

        // 1. Insert into recipes table
        const insertRecipeStmt = db.prepare(`
            INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id
        `);
        // Use run() first to get the ID, then construct the full recipe object later if needed
        // Note: RETURNING id might not work directly in batch, so we do this separately first.

        const recipeInsertResult = await insertRecipeStmt.bind(
            body.name.trim(),
            body.description ?? null,
            body.prep_time_minutes ?? null,
            body.cook_time_minutes ?? null,
            body.instructions ?? null,
            body.servings,
            user.id
        ).first<{ id: number }>(); // Use first() with RETURNING

        if (!recipeInsertResult?.id) {
             console.error("[API /api/recipes POST] Failed to insert recipe or retrieve ID.");
             throw error(500, "Failed to create recipe record.");
        }
        const newRecipeId = recipeInsertResult.id;
        console.log(`[API /api/recipes POST] Inserted recipe with ID: ${newRecipeId}`);


        // Prepare batch for ingredients and tools
        // 2. Insert into recipe_ingredients
        const insertIngredientStmt = db.prepare('INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)');
        body.ingredients.forEach(ing => {
            batchActions.push(insertIngredientStmt.bind(newRecipeId, ing.ingredient_id, ing.quantity));
        });

        // 3. Insert into recipe_kitchen_tools (if provided)
        if (body.kitchen_tool_ids && body.kitchen_tool_ids.length > 0) {
            const insertToolStmt = db.prepare('INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES (?, ?)');
            body.kitchen_tool_ids.forEach(toolId => {
                batchActions.push(insertToolStmt.bind(newRecipeId, toolId));
            });
        }

        // Execute batch for ingredients/tools
        if (batchActions.length > 0) {
             console.log(`[API /api/recipes POST] Executing batch of ${batchActions.length} ingredient/tool inserts for recipe ID: ${newRecipeId}`);
             await db.batch(batchActions);
        }

        // --- End Database Insertion ---

        // Fetch the complete recipe with ingredients and tools to return
        // Prepare statements for ingredients and tools
        const ingredientsStmt = db.prepare(`
            SELECT ri.ingredient_id, i.name, i.unit, i.type, ri.quantity
            FROM recipe_ingredients ri JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE ri.recipe_id = ?
        `);
        
        const toolsStmt = db.prepare(`
            SELECT kt.id, kt.name
            FROM recipe_kitchen_tools rkt JOIN kitchen_tools kt ON rkt.tool_id = kt.id
            WHERE rkt.recipe_id = ?
        `);

        // Fetch ingredients and tools for the new recipe
        const { results: ingredientsList } = await ingredientsStmt.bind(newRecipeId).all();
        const { results: toolsList } = await toolsStmt.bind(newRecipeId).all();
        
        // Construct the complete recipe object
        const newRecipe: Recipe = {
             id: newRecipeId,
             name: body.name.trim(),
             description: body.description ?? null,
             prep_time_minutes: body.prep_time_minutes ?? null,
             cook_time_minutes: body.cook_time_minutes ?? null,
             instructions: body.instructions ?? null,
             servings: body.servings,
             user_id: user.id,
             ingredients: ingredientsList || [],
             kitchen_tools: toolsList || []
        };

        console.log(`[API /api/recipes POST] Successfully created recipe ID: ${newRecipeId} with ${ingredientsList?.length || 0} ingredients and ${toolsList?.length || 0} tools for user: ${user.id}`);
        console.log(`[API /api/recipes POST] Recipe details: ${JSON.stringify(newRecipe)}`);
        return json({ recipe: newRecipe }, { status: 201 }); // 201 Created status

    } catch (e: any) {
        // Handle specific errors (like validation errors) or re-throw others
        if (e.status >= 400 && e.status < 500) {
            throw e; // Re-throw client-side errors
        }
        console.error('[API /api/recipes POST] Error creating recipe:', e);
        // Check for potential unique constraint errors if needed
        // if (e.message.includes('UNIQUE constraint failed')) {
        //     throw error(409, 'A recipe with this name might already exist.');
        // }
        throw error(500, `Failed to create recipe: ${e.message || 'Unknown error'}`);
    }
};