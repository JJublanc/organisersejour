import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { D1PreparedStatement } from '@cloudflare/workers-types'; // Import D1 type

// Define the expected structure of the request body for updating a meal
interface UpdateMealRequestBody {
    recipeIds?: number[]; // Optional: Array of recipe IDs to associate with the meal
    drinks?: string | null; // Optional: Description of drinks
    bread?: boolean; // Optional: Whether bread is included
}

export const PUT: RequestHandler = async ({ params, request, locals, platform }) => {
    const { mealId } = params;
    const db = platform?.env?.DB;

    // --- Authentication Check ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        console.log("[API /api/meals PUT] Auth disabled, creating mock user.");
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated || !user.id) {
        console.error("[API /api/meals PUT] User not authenticated.");
        throw error(401, 'User not authenticated');
    }
    const userId = user.id;
    // --- End Authentication Check ---

    if (!db) {
        console.error("[API /api/meals PUT] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }
    if (!mealId || isNaN(parseInt(mealId))) {
        console.error(`[API /api/meals PUT] Invalid mealId parameter: ${mealId}`);
        throw error(400, "Invalid Meal ID parameter.");
    }
    const mealIdNum = parseInt(mealId);

    try {
        const body: UpdateMealRequestBody = await request.json();
        console.log(`[API /api/meals PUT] Received update request for meal ID: ${mealIdNum}`, body);

        // --- Authorization Check: Verify the meal belongs to the authenticated user ---
        const authCheckStmt = db.prepare(`
            SELECT t.organiser_id
            FROM meals m
            JOIN trip_days td ON m.trip_day_id = td.id
            JOIN trips t ON td.trip_id = t.id
            WHERE m.id = ?
        `);
        const authResult = await authCheckStmt.bind(mealIdNum).first<{ organiser_id: string }>();

        if (!authResult || authResult.organiser_id !== userId) {
            console.warn(`[API /api/meals PUT] Authorization failed: User ${userId} cannot modify meal ${mealIdNum}.`);
            throw error(403, 'Forbidden: You do not have permission to modify this meal.');
        }
        console.log(`[API /api/meals PUT] Authorization successful for user ${userId} on meal ${mealIdNum}.`);
        // --- End Authorization Check ---

        // --- Prepare updates ---
        const updates: string[] = [];
        const bindings: (string | number | boolean | null)[] = [];

        if (body.drinks !== undefined) {
            updates.push('drinks = ?');
            bindings.push(body.drinks);
        }
        if (body.bread !== undefined) {
            updates.push('bread = ?');
            // D1 expects 0 or 1 for BOOLEAN
            bindings.push(body.bread ? 1 : 0);
        }

        // --- Begin Transaction ---
        const batchActions: D1PreparedStatement[] = [];

        // 1. Update the meals table if there are changes
        if (updates.length > 0) {
            bindings.push(mealIdNum); // Add mealId for the WHERE clause
            const updateMealStmt = db.prepare(`UPDATE meals SET ${updates.join(', ')} WHERE id = ?`);
            batchActions.push(updateMealStmt.bind(...bindings));
            console.log(`[API /api/meals PUT] Prepared update for meals table: SET ${updates.join(', ')} WHERE id = ${mealIdNum}`);
        }

        // 2. Update meal_recipes if recipeIds are provided
        if (body.recipeIds !== undefined) {
            // a. Delete existing associations
            const deleteRecipesStmt = db.prepare('DELETE FROM meal_recipes WHERE meal_id = ?');
            batchActions.push(deleteRecipesStmt.bind(mealIdNum));
            console.log(`[API /api/meals PUT] Prepared delete for existing meal_recipes for meal ID: ${mealIdNum}`);

            // b. Insert new associations
            if (body.recipeIds.length > 0) {
                 const insertRecipeStmt = db.prepare('INSERT INTO meal_recipes (meal_id, recipe_id) VALUES (?, ?)');
                 body.recipeIds.forEach(recipeId => {
                     if (typeof recipeId === 'number' && !isNaN(recipeId)) {
                         batchActions.push(insertRecipeStmt.bind(mealIdNum, recipeId));
                     } else {
                          console.warn(`[API /api/meals PUT] Invalid recipeId skipped: ${recipeId}`);
                     }
                 });
                 console.log(`[API /api/meals PUT] Prepared insert for ${body.recipeIds.length} new meal_recipes for meal ID: ${mealIdNum}`);
            }
        }

        // --- Execute Transaction ---
        if (batchActions.length > 0) {
             console.log(`[API /api/meals PUT] Executing batch of ${batchActions.length} actions...`);
             await db.batch(batchActions);
             console.log(`[API /api/meals PUT] Batch execution successful for meal ID: ${mealIdNum}`);
        } else {
             console.log(`[API /api/meals PUT] No updates to execute for meal ID: ${mealIdNum}`);
        }

        return json({ message: 'Meal updated successfully' }, { status: 200 });

    } catch (e: any) {
        // Handle specific errors like 403 or re-throw others
        if (e.status === 403 || e.status === 401 || e.status === 400) {
            throw e;
        }
        console.error(`[API /api/meals PUT] Error updating meal ID ${mealIdNum}:`, e);
        // Check for JSON parsing errors specifically
        if (e instanceof SyntaxError) {
             throw error(400, 'Invalid request body: Malformed JSON.');
        }
        throw error(500, `Failed to update meal: ${e.message || 'Unknown error'}`);
    }
};