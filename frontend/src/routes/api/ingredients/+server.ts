import { json, error, type RequestHandler } from '@sveltejs/kit'; // Consolidate imports
import type { Ingredient } from '$lib/types'; // Import the Ingredient type

// --- GET Handler (Updated) ---
// Explicitly type platform using the global App namespace
export const GET: RequestHandler = async ({ platform, locals }) => {
    const db = platform?.env?.DB;
    
    // --- Authentication ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    console.log(`[API /api/ingredients GET] Auth enabled: ${authEnabled}, user: ${user ? JSON.stringify(user) : 'undefined'}`);
    
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user2', name: 'Development User', authenticated: true };
        console.log(`[API /api/ingredients GET] Created default user: ${JSON.stringify(user)}`);
    }
    if (!user?.authenticated) {
        console.warn("[API /api/ingredients GET] Unauthenticated user attempted to fetch ingredients.");
        throw error(401, 'Authentication required to access ingredients.');
    }
    // --- End Authentication ---
    
    if (!db) {
        console.error("[API /api/ingredients GET] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        console.log(`[API /api/ingredients GET] Fetching ingredients for user: ${user.id}`);

        const stmt = db.prepare('SELECT id, name, unit, type, season, user_id FROM ingredients WHERE user_id = ? ORDER BY type ASC, name ASC');
        const { results } = await stmt.bind(user.id).all<Ingredient>();

        // Log ingredient types distribution for validation
        if (results && results.length > 0) {
            const typeDistribution = results.reduce((acc, ing) => {
                acc[ing.type] = (acc[ing.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            console.log(`[API /api/ingredients GET] Type distribution: ${JSON.stringify(typeDistribution)}`);
        }

        console.log(`[API /api/ingredients GET] Successfully fetched ${results?.length ?? 0} ingredients.`);
        return json({ ingredients: results || [] });

    } catch (e: any) {
        console.error('[API /api/ingredients GET] Error fetching ingredients:', e);
        throw error(500, `Failed to fetch ingredients: ${e.message || 'Unknown error'}`);
    }
};

// --- POST Handler (New) ---
export const POST: RequestHandler = async ({ request, platform, locals }) => {
    const db = platform?.env?.DB;

    // --- Authentication (Optional - decide if needed) ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    console.log(`[API /api/ingredients POST] Auth enabled: ${authEnabled}, user: ${user ? JSON.stringify(user) : 'undefined'}`);
    
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user2', name: 'Development User', authenticated: true };
        console.log(`[API /api/ingredients POST] Created default user: ${JSON.stringify(user)}`);
    }
    // For now, let's allow authenticated users to add ingredients
    if (!user?.authenticated) {
         console.warn("[API /api/ingredients POST] Unauthenticated user attempted ingredient creation.");
         throw error(401, 'Authentication required to add ingredients.');
    }
    // --- End Authentication ---

    if (!db) {
        console.error("[API /api/ingredients POST] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        const body = await request.json();
        const name = body.name?.toString().trim();
        const unit = body.unit?.toString().trim();
        const type = body.type?.toString().trim() || 'autre';
        const season = body.season === null ? null : body.season?.toString().trim();

        // Validate type is one of the allowed values
        const validTypes = ['boisson', 'pain', 'condiment', 'légume', 'fruit', 'viande', 'poisson', 'autre'];
        if (!validTypes.includes(type)) {
            throw error(400, `Invalid ingredient type: ${type}. Must be one of: ${validTypes.join(', ')}`);
        }

        // Validate season is one of the allowed values
        const validSeasons = ['spring', 'summer', 'autumn', 'winter', null];
        if (!validSeasons.includes(season)) {
            throw error(400, `Invalid ingredient season: ${season}. Must be one of: spring, summer, autumn, winter, or null`);
        }

        console.log("[API /api/ingredients POST] Received ingredient creation request:", { name, unit, type, season });

        // --- Validation ---
        if (!name || name === '') {
            throw error(400, 'Ingredient name is required.');
        }
        if (!unit || unit === '') {
            // Default unit or require it? Let's require it for now.
            throw error(400, 'Ingredient unit is required.');
        }
        // Could add max length validation etc.
        // --- End Validation ---

        // --- Database Insertion ---
        try {
            const stmt = db.prepare('INSERT INTO ingredients (name, unit, type, season, user_id) VALUES (?, ?, ?, ?, ?) RETURNING id, name, unit, type, season, user_id');
            const newIngredient = await stmt.bind(name, unit, type, season, user.id).first<Ingredient>();

            if (!newIngredient) {
                 console.error("[API /api/ingredients POST] Failed to insert ingredient or retrieve result.");
                 throw error(500, "Failed to create ingredient record.");
            }

            console.log(`[API /api/ingredients POST] Successfully created ingredient ID: ${newIngredient.id} with type: ${newIngredient.type} for user: ${user.id}`);
            console.log(`[API /api/ingredients POST] Ingredient details: ${JSON.stringify(newIngredient)}`);
            return json({ ingredient: newIngredient }, { status: 201 }); // 201 Created

        } catch (dbError: any) {
             // Handle potential unique constraint violation (name is UNIQUE)
             if (dbError.message?.includes('UNIQUE constraint failed')) {
                 console.warn(`[API /api/ingredients POST] Attempted to create duplicate ingredient name: ${name}`);
                 throw error(409, `Un ingrédient nommé '${name}' existe déjà.`); // 409 Conflict
             }
             // Re-throw other DB errors
             throw dbError;
        }
        // --- End Database Insertion ---

    } catch (e: any) {
        // Handle specific errors (like validation or DB errors) or re-throw others
        if (e.status >= 400 && e.status < 500) {
            throw e; // Re-throw client-side or conflict errors
        }
        console.error('[API /api/ingredients POST] Error creating ingredient:', e);
        throw error(500, `Failed to create ingredient: ${e.message || 'Unknown error'}`);
    }
};

// --- DELETE Handler ---
export const DELETE: RequestHandler = async ({ request, platform, locals, url }) => {
    const db = platform?.env?.DB;
    
    // --- Authentication ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user2', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated) {
        console.warn("[API /api/ingredients DELETE] Unauthenticated user attempted to delete ingredient.");
        throw error(401, 'Authentication required to delete ingredients.');
    }
    // --- End Authentication ---
    
    if (!db) {
        console.error("[API /api/ingredients DELETE] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }
    
    try {
        // Get ingredient ID from query parameter
        const ingredientId = url.searchParams.get('id');
        if (!ingredientId || isNaN(parseInt(ingredientId))) {
            throw error(400, "Invalid ingredient ID parameter.");
        }
        
        const id = parseInt(ingredientId);
        console.log(`[API /api/ingredients DELETE] Attempting to delete ingredient ID: ${id} for user: ${user.id}`);
        
        // Check if ingredient belongs to user
        const checkStmt = db.prepare('SELECT id FROM ingredients WHERE id = ? AND user_id = ?');
        const ingredient = await checkStmt.bind(id, user.id).first<{ id: number }>();
        
        if (!ingredient) {
            throw error(404, "Ingredient not found or you don't have permission to delete it.");
        }
        
        // Check if ingredient is used in any recipes
        const usageCheckStmt = db.prepare('SELECT COUNT(*) as count FROM recipe_ingredients WHERE ingredient_id = ?');
        const usageResult = await usageCheckStmt.bind(id).first<{ count: number }>();
        
        if (usageResult && usageResult.count > 0) {
            throw error(409, `Cet ingrédient est utilisé dans ${usageResult.count} recette(s) et ne peut pas être supprimé.`);
        }
        
        // Check if ingredient is used in any meal components
        const mealCheckStmt = db.prepare('SELECT COUNT(*) as count FROM meal_components WHERE ingredient_id = ?');
        const mealResult = await mealCheckStmt.bind(id).first<{ count: number }>();
        
        if (mealResult && mealResult.count > 0) {
            throw error(409, `Cet ingrédient est utilisé dans ${mealResult.count} repas et ne peut pas être supprimé.`);
        }
        
        // Delete the ingredient
        const deleteStmt = db.prepare('DELETE FROM ingredients WHERE id = ? AND user_id = ?');
        const result = await deleteStmt.bind(id, user.id).run();
        
        if (!result.success) {
            throw error(500, "Failed to delete ingredient.");
        }
        
        console.log(`[API /api/ingredients DELETE] Successfully deleted ingredient ID: ${id}`);
        return json({ success: true, message: "Ingrédient supprimé avec succès." });
        
    } catch (e: any) {
        if (e.status >= 400 && e.status < 500) {
            throw e; // Re-throw client-side errors
        }
        console.error('[API /api/ingredients DELETE] Error deleting ingredient:', e);
        throw error(500, `Failed to delete ingredient: ${e.message || 'Unknown error'}`);
    }
};