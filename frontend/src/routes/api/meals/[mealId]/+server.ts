import { json, error, type RequestHandler } from '@sveltejs/kit';
import { getNeonDbUrl, getDbClient } from '$lib/server/db';
import type { TransactionSql, PendingQuery } from 'postgres';

// Define the expected structure for a component in the request body
interface MealComponentPayload {
	course_type: 'starter' | 'main' | 'dessert' | 'side' | 'extra' | 'breakfast_item';
	recipe_id?: number | null;
	ingredient_id?: number | null;
	total_quantity?: number | null;
	unit?: string | null;
	quantity_per_person?: number | null;
	notes?: string | null;
	display_order?: number;
}

// Define the expected structure of the request body for updating a meal
interface UpdateMealRequestBody {
    components: MealComponentPayload[];
    drinks?: string | null;
    bread?: boolean;
}

export const PUT: RequestHandler = async ({ params, request, locals, platform }) => {
    const { mealId } = params;
    const dbUrl = getNeonDbUrl(platform?.env);

    if (!dbUrl) {
        console.error("[API /api/meals PUT] Neon Database URL not found for environment.");
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
    if (!user?.authenticated || !user.id) {
        throw error(401, 'User not authenticated');
    }
    const userId = user.id;

    if (!mealId || isNaN(parseInt(mealId))) {
        throw error(400, "Invalid Meal ID parameter.");
    }
    const mealIdNum = parseInt(mealId);

    try {
        const body: UpdateMealRequestBody = await request.json();
        console.log(`[API /api/meals PUT] Received update request for meal ID: ${mealIdNum}`, body);

        if (!Array.isArray(body.components)) {
             throw error(400, 'Invalid request body: "components" array is required.');
        }
        for (const comp of body.components) {
            if (!comp.course_type) throw error(400, 'Invalid component: course_type is required.');
            const isRecipe = comp.recipe_id != null && comp.recipe_id > 0;
            const isIngredient = comp.ingredient_id != null && comp.ingredient_id > 0;
            if (isRecipe && isIngredient) throw error(400, 'Invalid component: Cannot have both recipe_id and ingredient_id.');
            if (!isRecipe && !isIngredient) throw error(400, 'Invalid component: Must have either recipe_id or ingredient_id.');
            if (isIngredient) {
                if (!comp.unit || comp.unit.trim() === '') throw error(400, 'Invalid component: Direct ingredient requires a unit.');
                if (comp.quantity_per_person == null || comp.quantity_per_person <= 0) throw error(400, 'Invalid component: Direct ingredient requires a positive quantity_per_person.');
                if (comp.total_quantity != null) throw error(400, 'Invalid component: total_quantity should not be set for direct ingredient with quantity_per_person.');
            }
            if (isRecipe) {
                if (comp.quantity_per_person != null || comp.unit != null || comp.total_quantity != null) {
                    throw error(400, 'Invalid component: quantity_per_person, unit, or total_quantity should not be set for a recipe component.');
                }
            }
        }

        const authResults = await sql<{ organiser_id: string }[]>`
            SELECT t.organiser_id
            FROM meals m
            JOIN trip_days td ON m.trip_day_id = td.id
            JOIN trips t ON td.trip_id = t.id
            WHERE m.id = ${mealIdNum}
        `;
        const authMeal = authResults[0];

        if (!authMeal || authMeal.organiser_id !== userId) {
            throw error(403, 'Forbidden: You do not have permission to modify this meal.');
        }
        console.log(`[API /api/meals PUT] Authorization successful for user ${userId} on meal ${mealIdNum}.`);

        await sql.begin(async (sqltrx: TransactionSql) => {
            await sqltrx`DELETE FROM meal_components WHERE meal_id = ${mealIdNum}`;
            console.log(`[API /api/meals PUT] Executed delete for existing meal_components for meal ID: ${mealIdNum}`);

            for (const [index, comp] of body.components.entries()) {
                const isIngredient = comp.ingredient_id != null && comp.ingredient_id > 0;
                await sqltrx`
                    INSERT INTO meal_components
                        (meal_id, course_type, recipe_id, ingredient_id, total_quantity, unit, quantity_per_person, notes, display_order)
                    VALUES (${mealIdNum}, ${comp.course_type}, ${comp.recipe_id ?? null}, ${comp.ingredient_id ?? null}, ${comp.total_quantity ?? null},
                            ${isIngredient ? (comp.unit ?? null) : null}, ${isIngredient ? (comp.quantity_per_person ?? null) : null},
                            ${comp.notes ?? null}, ${comp.display_order ?? index})
                `;
            }
            console.log(`[API /api/meals PUT] Executed insert for ${body.components.length} new meal_components for meal ID: ${mealIdNum}`);

            // Update meal properties if needed
            if (body.drinks !== undefined || body.bread !== undefined) {
                // Build the query directly without using sql.join
                let query = 'UPDATE meals SET ';
                const updates = [];
                const values = [];
                
                if (body.drinks !== undefined) {
                    updates.push('drinks = $1');
                    values.push(body.drinks);
                }
                
                if (body.bread !== undefined) {
                    updates.push(`bread = ${body.bread ? 'TRUE' : 'FALSE'}`);
                }
                
                query += updates.join(', ');
                query += ` WHERE id = ${mealIdNum}`;
                
                if (body.drinks !== undefined) {
                    await sqltrx.unsafe(query, values);
                } else {
                    await sqltrx.unsafe(query);
                }
                
                console.log(`[API /api/meals PUT] Executed update for meals table for meal ID: ${mealIdNum}`);
            }
        });
        console.log(`[API /api/meals PUT] Transaction committed for meal ID: ${mealIdNum}`);
        return json({ message: 'Meal updated successfully' }, { status: 200 });
    } catch (e: any) {
        if (e.status >= 400 && e.status < 500) throw e;
        console.error(`[API /api/meals PUT] Error updating meal ID ${mealIdNum}:`, e);
        if (e instanceof SyntaxError) throw error(400, 'Invalid request body: Malformed JSON.');
        throw error(500, `Failed to update meal: ${e.message || 'Unknown error'}`);
    }
};