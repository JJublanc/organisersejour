import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { D1PreparedStatement } from '@cloudflare/workers-types';

// Define the expected structure for a component in the request body
interface MealComponentPayload {
	course_type: 'starter' | 'main' | 'dessert' | 'side' | 'extra' | 'breakfast_item';
	recipe_id?: number | null;
	ingredient_id?: number | null;
	total_quantity?: number | null; // Optional: Can be used for pre-calculated totals or non-person based items
	unit?: string | null; // Required for direct ingredients
	quantity_per_person?: number | null; // Required for direct ingredients
	notes?: string | null;
	display_order?: number;
}

// Define the expected structure of the request body for updating a meal
interface UpdateMealRequestBody {
    components: MealComponentPayload[]; // Array of components for the meal
    drinks?: string | null;
    bread?: boolean;
}

export const PUT: RequestHandler = async ({ params, request, locals, platform }) => {
    const { mealId } = params;
    const db = platform?.env?.DB;

    // --- Authentication Check ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated || !user.id) {
        throw error(401, 'User not authenticated');
    }
    const userId = user.id;
    // --- End Authentication Check ---

    if (!db) {
        throw error(500, "Database binding not found.");
    }
    if (!mealId || isNaN(parseInt(mealId))) {
        throw error(400, "Invalid Meal ID parameter.");
    }
    const mealIdNum = parseInt(mealId);

    try {
        const body: UpdateMealRequestBody = await request.json();
        console.log(`[API /api/meals PUT] Received update request for meal ID: ${mealIdNum}`, body);

        // --- Validation ---
        if (!Array.isArray(body.components)) {
             throw error(400, 'Invalid request body: "components" array is required.');
        }
        // Add more validation for each component if needed (e.g., check course_type, ensure recipe XOR ingredient)
  for (const comp of body.components) {
   if (!comp.course_type) throw error(400, 'Invalid component: course_type is required.');
   const isRecipe = comp.recipe_id != null && comp.recipe_id > 0;
   const isIngredient = comp.ingredient_id != null && comp.ingredient_id > 0;
   if (isRecipe && isIngredient) throw error(400, 'Invalid component: Cannot have both recipe_id and ingredient_id.');
   if (!isRecipe && !isIngredient) throw error(400, 'Invalid component: Must have either recipe_id or ingredient_id.');
   // Validation for direct ingredients
   if (isIngredient) {
    if (!comp.unit || comp.unit.trim() === '') throw error(400, 'Invalid component: Direct ingredient requires a unit.');
    if (comp.quantity_per_person == null || comp.quantity_per_person <= 0) throw error(400, 'Invalid component: Direct ingredient requires a positive quantity_per_person.');
    if (comp.total_quantity != null) throw error(400, 'Invalid component: total_quantity should not be set when quantity_per_person and unit are provided for a direct ingredient.');
   }
   // Validation for recipe components
   if (isRecipe) {
    if (comp.quantity_per_person != null) throw error(400, 'Invalid component: quantity_per_person should not be set for a recipe component.');
    if (comp.unit != null) throw error(400, 'Invalid component: unit should not be set for a recipe component.');
    if (comp.total_quantity != null) throw error(400, 'Invalid component: total_quantity should not be set for a recipe component.');
   }
  }
        // --- End Validation ---


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
            throw error(403, 'Forbidden: You do not have permission to modify this meal.');
        }
        console.log(`[API /api/meals PUT] Authorization successful for user ${userId} on meal ${mealIdNum}.`);
        // --- End Authorization Check ---

        // --- Prepare updates within a transaction ---
        const batchActions: D1PreparedStatement[] = [];

        // 1. Delete existing components for this meal
        const deleteComponentsStmt = db.prepare('DELETE FROM meal_components WHERE meal_id = ?');
        batchActions.push(deleteComponentsStmt.bind(mealIdNum));
        console.log(`[API /api/meals PUT] Prepared delete for existing meal_components for meal ID: ${mealIdNum}`);

        // 2. Insert new components
        const insertComponentStmt = db.prepare(`
   INSERT INTO meal_components
    (meal_id, course_type, recipe_id, ingredient_id, total_quantity, unit, quantity_per_person, notes, display_order)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  body.components.forEach((comp, index) => {
   const isIngredient = comp.ingredient_id != null && comp.ingredient_id > 0;
   batchActions.push(insertComponentStmt.bind(
    mealIdNum,
    comp.course_type,
    comp.recipe_id ?? null,
    comp.ingredient_id ?? null,
    comp.total_quantity ?? null, // Keep total_quantity field, but it's usually null now
    isIngredient ? comp.unit : null, // Only set unit for direct ingredients
    isIngredient ? comp.quantity_per_person : null, // Only set quantity_per_person for direct ingredients
    comp.notes ?? null,
    comp.display_order ?? index // Use provided order or array index
   ));
  });
        console.log(`[API /api/meals PUT] Prepared insert for ${body.components.length} new meal_components for meal ID: ${mealIdNum}`);

        // 3. Update meals table for drinks/bread (if changed)
        const mealUpdates: string[] = [];
        const mealBindings: (string | number | boolean | null)[] = [];
        let mealNeedsUpdate = false;

        if (body.drinks !== undefined) {
            mealUpdates.push('drinks = ?');
            mealBindings.push(body.drinks);
            mealNeedsUpdate = true;
        }
        if (body.bread !== undefined) {
            mealUpdates.push('bread = ?');
            mealBindings.push(body.bread ? 1 : 0); // D1 expects 0 or 1
            mealNeedsUpdate = true;
        }

        if (mealNeedsUpdate) {
            mealBindings.push(mealIdNum); // Add mealId for the WHERE clause
            const updateMealStmt = db.prepare(`UPDATE meals SET ${mealUpdates.join(', ')} WHERE id = ?`);
            batchActions.push(updateMealStmt.bind(...mealBindings));
            console.log(`[API /api/meals PUT] Prepared update for meals table: SET ${mealUpdates.join(', ')} WHERE id = ${mealIdNum}`);
        }

        // --- Execute Transaction ---
        if (batchActions.length > 0) {
             console.log(`[API /api/meals PUT] Executing batch of ${batchActions.length} actions...`);
             await db.batch(batchActions);
             console.log(`[API /api/meals PUT] Batch execution successful for meal ID: ${mealIdNum}`);
        } else {
             console.log(`[API /api/meals PUT] No database actions to execute for meal ID: ${mealIdNum}`);
        }

        return json({ message: 'Meal updated successfully' }, { status: 200 });

    } catch (e: any) {
        // Handle specific errors like 403 or re-throw others
        if (e.status >= 400 && e.status < 500) {
            throw e;
        }
        console.error(`[API /api/meals PUT] Error updating meal ID ${mealIdNum}:`, e);
        if (e instanceof SyntaxError) {
             throw error(400, 'Invalid request body: Malformed JSON.');
        }
        throw error(500, `Failed to update meal: ${e.message || 'Unknown error'}`);
    }
};