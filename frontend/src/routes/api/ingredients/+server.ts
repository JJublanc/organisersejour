import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { Ingredient } from '$lib/types';
import { getNeonDbUrl, getDbClient } from '$lib/server/db';

// --- GET Handler (Updated) ---
export const GET: RequestHandler = async ({ platform, locals }) => {
    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[API /api/ingredients GET] Neon Database URL not found for environment.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);

    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated) {
        console.warn("[API /api/ingredients GET] Unauthenticated user attempted to fetch ingredients.");
        throw error(401, 'Authentication required to access ingredients.');
    }

    try {
        console.log(`[API /api/ingredients GET] Fetching ingredients for user: ${user.id} and system ingredients`);
        // Using tagged template literal for the query
        const ingredients = await sql<Ingredient[]>`
            SELECT id, name, unit, type, season, user_id
            FROM ingredients
            WHERE user_id = ${user.id} OR user_id = 'system'
            ORDER BY type ASC, name ASC
        `;

        if (ingredients && ingredients.length > 0) {
            const typeDistribution = ingredients.reduce((acc: Record<string, number>, ing: Ingredient) => {
                acc[ing.type] = (acc[ing.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            console.log(`[API /api/ingredients GET] Type distribution: ${JSON.stringify(typeDistribution)}`);
        }
        console.log(`[API /api/ingredients GET] Successfully fetched ${ingredients?.length ?? 0} ingredients.`);
        return json({ ingredients: ingredients || [] });
    } catch (e: any) {
        console.error('[API /api/ingredients GET] Error fetching ingredients:', e);
        throw error(500, `Failed to fetch ingredients: ${e.message || 'Unknown error'}`);
    }
    // No client.release() or sql.end() needed here for postgres.js in serverless typically
};

// --- POST Handler (New) ---
export const POST: RequestHandler = async ({ request, platform, locals }) => {
    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[API /api/ingredients POST] Neon Database URL not found for environment.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);

    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated) {
         console.warn("[API /api/ingredients POST] Unauthenticated user attempted ingredient creation.");
         throw error(401, 'Authentication required to add ingredients.');
    }

    try {
        const body = await request.json();
        const name = body.name?.toString().trim();
        const unit = body.unit?.toString().trim();
        const type = body.type?.toString().trim() || 'autre';
        const season = body.season === null ? null : body.season?.toString().trim();

        const validTypes = ['boisson', 'pain', 'condiment', 'légume', 'fruit', 'viande', 'poisson', 'autre'];
        if (!validTypes.includes(type)) {
            throw error(400, `Invalid ingredient type: ${type}. Must be one of: ${validTypes.join(', ')}`);
        }
        const validSeasons = ['spring', 'summer', 'autumn', 'winter', null];
        if (!validSeasons.includes(season)) {
            throw error(400, `Invalid ingredient season: ${season}. Must be one of: spring, summer, autumn, winter, or null`);
        }

        console.log("[API /api/ingredients POST] Received ingredient creation request:", { name, unit, type, season });

        if (!name || name === '') throw error(400, 'Ingredient name is required.');
        if (!unit || unit === '') throw error(400, 'Ingredient unit is required.');

        // Using tagged template literal for insertion with RETURNING
        const results = await sql<Ingredient[]>`
            INSERT INTO ingredients (name, unit, type, season, user_id)
            VALUES (${name}, ${unit}, ${type}, ${season}, ${user.id})
            RETURNING id, name, unit, type, season, user_id
        `;
        const newIngredient = results[0];

        if (!newIngredient) {
             console.error("[API /api/ingredients POST] Failed to insert ingredient or retrieve result.");
             throw error(500, "Failed to create ingredient record.");
        }
        console.log(`[API /api/ingredients POST] Successfully created ingredient ID: ${newIngredient.id} with type: ${newIngredient.type} for user: ${user.id}`);
        console.log(`[API /api/ingredients POST] Ingredient details: ${JSON.stringify(newIngredient)}`);
        return json({ ingredient: newIngredient }, { status: 201 });
    } catch (e: any) {
         // Check for PostgreSQL unique violation error code
         if (e.code === '23505') {
             // To get the name for the error message, we might need to access body again,
             // or pass it through if this was a helper function.
             // For simplicity, using a generic message or re-parsing (if safe and body is small).
             const bodyForError = await request.clone().json(); // Re-parse for error message if needed
             console.warn(`[API /api/ingredients POST] Attempted to create duplicate ingredient name: ${bodyForError.name}`);
             throw error(409, `Un ingrédient nommé '${bodyForError.name}' existe déjà.`);
         }
         if (e.status >= 400 && e.status < 500) throw e; // Re-throw client-side errors
         console.error('[API /api/ingredients POST] Error creating ingredient:', e);
         throw error(500, `Failed to create ingredient: ${e.message || 'Unknown error'}`);
    }
};

 export const DELETE: RequestHandler = async ({ request, platform, locals, url }) => {
     const dbUrl = getNeonDbUrl(platform?.env);
     if (!dbUrl) {
         console.error("[API /api/ingredients DELETE] Neon Database URL not found for environment.");
         throw error(500, "Database connection information not found.");
     }
     const sql = getDbClient(dbUrl);

     let user = locals.user;
     const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
     if (!authEnabled && !user) {
         user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
     }
     if (!user?.authenticated) {
         console.warn("[API /api/ingredients DELETE] Unauthenticated user attempted to delete ingredient.");
         throw error(401, 'Authentication required to delete ingredients.');
     }

     try {
         const ingredientIdParam = url.searchParams.get('id');
         if (!ingredientIdParam || isNaN(parseInt(ingredientIdParam))) {
             throw error(400, "Invalid ingredient ID parameter.");
         }
         const id = parseInt(ingredientIdParam);
         console.log(`[API /api/ingredients DELETE] Attempting to delete ingredient ID: ${id} for user: ${user.id}`);

         const ingredients = await sql<{ id: number, user_id: string }[]>`
            SELECT id, user_id FROM ingredients WHERE id = ${id}
         `;
         const ingredient = ingredients[0];

         if (!ingredient) {
             throw error(404, "Ingredient not found.");
         }
         if (ingredient.user_id === 'system') {
             throw error(403, "Les ingrédients système ne peuvent pas être supprimés.");
         }
         if (ingredient.user_id !== user.id) {
             throw error(403, "Vous n'avez pas la permission de supprimer cet ingrédient.");
         }

         const recipeUsageResults = await sql<{ count: string }[]>`
            SELECT COUNT(*) as count FROM recipe_ingredients WHERE ingredient_id = ${id}
         `;
         const recipeUsageCount = recipeUsageResults[0] ? parseInt(recipeUsageResults[0].count) : 0;
         if (recipeUsageCount > 0) {
             throw error(409, `Cet ingrédient est utilisé dans ${recipeUsageCount} recette(s) et ne peut pas être supprimé.`);
         }

         const mealUsageResults = await sql<{ count: string }[]>`
            SELECT COUNT(*) as count FROM meal_components WHERE ingredient_id = ${id}
         `;
         const mealUsageCount = mealUsageResults[0] ? parseInt(mealUsageResults[0].count) : 0;
         if (mealUsageCount > 0) {
             throw error(409, `Cet ingrédient est utilisé dans ${mealUsageCount} repas et ne peut pas être supprimé.`);
         }

         // For DELETE, postgres.js returns an array of results (empty for DELETE unless RETURNING)
         // but also has a .count property for DML statements.
         const deleteResult = await sql`
            DELETE FROM ingredients WHERE id = ${id} AND user_id = ${user.id}
         `;

         if (deleteResult.count === 0) {
             // This implies the ingredient was not found for that user, or already deleted.
             // The checks above should ideally catch "not found" or "permission denied" more specifically.
             // If it reaches here with count 0, it might mean it was deleted between check and delete (race condition)
             // or the user_id check in the DELETE itself failed after passing earlier checks (unlikely if data is consistent).
             throw error(500, "Failed to delete ingredient (no rows affected or permission issue).");
         }
         console.log(`[API /api/ingredients DELETE] Successfully deleted ingredient ID: ${id}`);
         return json({ success: true, message: "Ingrédient supprimé avec succès." });
     } catch (e: any) {
         if (e.status >= 400 && e.status < 500) { // Re-throw client-side errors
             throw e;
         }
         console.error('[API /api/ingredients DELETE] Error deleting ingredient:', e);
         throw error(500, `Failed to delete ingredient: ${e.message || 'Unknown error'}`);
     }
 };