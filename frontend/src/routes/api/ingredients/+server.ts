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
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
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

        const stmt = db.prepare('SELECT id, name, unit, type, user_id FROM ingredients WHERE user_id = ? ORDER BY type ASC, name ASC');
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
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
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

        // Validate type is one of the allowed values
        const validTypes = ['boisson', 'pain', 'condiment', 'légume', 'fruit', 'viande', 'poisson', 'autre'];
        if (!validTypes.includes(type)) {
            throw error(400, `Invalid ingredient type: ${type}. Must be one of: ${validTypes.join(', ')}`);
        }

        console.log("[API /api/ingredients POST] Received ingredient creation request:", { name, unit, type });

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
            const stmt = db.prepare('INSERT INTO ingredients (name, unit, type, user_id) VALUES (?, ?, ?, ?) RETURNING id, name, unit, type, user_id');
            const newIngredient = await stmt.bind(name, unit, type, user.id).first<Ingredient>();

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