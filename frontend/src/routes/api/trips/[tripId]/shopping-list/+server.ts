import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { Trip } from '$lib/types'; // Import Trip from $lib/types

// Define structure for recipe ingredients needed for calculation
interface RecipeIngredientInfo {
    recipe_id: number;
    ingredient_id: number;
    ingredient_name: string;
    ingredient_unit: string;
    quantity: number; // Quantity per base serving
    recipe_servings: number; // Base servings for the recipe
}

// ShoppingListItem is now defined in $lib/types.ts
import type { ShoppingListItem } from '$lib/types'; // Import it

export const GET: RequestHandler = async ({ params, locals, platform }) => {
    const { tripId } = params;
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
    if (!tripId || isNaN(parseInt(tripId))) {
        throw error(400, "Invalid Trip ID parameter.");
    }
    const tripIdNum = parseInt(tripId);

    try {
        console.log(`[API ShoppingList GET] Generating shopping list for trip ID: ${tripIdNum}, User: ${userId}`);

        // 1. Fetch trip details (num_people) and verify ownership
        const tripStmt = db.prepare('SELECT num_people, organiser_id FROM trips WHERE id = ?');
        const tripInfo = await tripStmt.bind(tripIdNum).first<{ num_people: number; organiser_id: string }>();

        if (!tripInfo) {
            throw error(404, 'Trip not found');
        }
        if (tripInfo.organiser_id !== userId) {
            throw error(403, 'Forbidden: You do not own this trip.');
        }
        const numPeople = tripInfo.num_people;
        console.log(`[API ShoppingList GET] Trip found. Attendees: ${numPeople}`);

        // 2. Fetch all ingredients linked to recipes used in meals for this trip
        // This complex query joins trips -> trip_days -> meals -> meal_recipes -> recipes -> recipe_ingredients -> ingredients
        const ingredientsQuery = `
            SELECT
                ri.recipe_id,
                ri.ingredient_id,
                i.name AS ingredient_name,
                i.unit AS ingredient_unit,
                ri.quantity,
                r.servings AS recipe_servings
            FROM trips t
            JOIN trip_days td ON t.id = td.trip_id
            JOIN meals m ON td.id = m.trip_day_id
            JOIN meal_recipes mr ON m.id = mr.meal_id
            JOIN recipes r ON mr.recipe_id = r.id
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id
            JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE t.id = ? AND t.organiser_id = ?
        `;
        const ingredientsStmt = db.prepare(ingredientsQuery);
        const { results: allIngredients } = await ingredientsStmt.bind(tripIdNum, userId).all<RecipeIngredientInfo>();

        if (!allIngredients || allIngredients.length === 0) {
            console.log(`[API ShoppingList GET] No ingredients found for trip ${tripIdNum}.`);
            return json({ shoppingList: [] });
        }
        console.log(`[API ShoppingList GET] Found ${allIngredients.length} ingredient instances across all meals.`);

        // 3. Calculate scaled quantities and aggregate
        const aggregatedList: Map<number, ShoppingListItem> = new Map(); // Use imported type

        for (const item of allIngredients) {
            // Calculate scaling factor (avoid division by zero or invalid servings)
            const servings = item.recipe_servings > 0 ? item.recipe_servings : 1;
            const scaleFactor = numPeople / servings;
            const requiredQuantity = item.quantity * scaleFactor;

            const existingItem = aggregatedList.get(item.ingredient_id);

            if (existingItem) {
                // TODO: Add unit conversion logic if units differ for the same ingredient ID?
                // For now, assume units are consistent per ingredient ID.
                if (existingItem.unit !== item.ingredient_unit) {
                     console.warn(`[API ShoppingList GET] Mismatched units for ingredient ID ${item.ingredient_id}: '${existingItem.unit}' vs '${item.ingredient_unit}'. Aggregating anyway.`);
                }
                existingItem.total_quantity += requiredQuantity;
            } else {
                aggregatedList.set(item.ingredient_id, {
                    ingredient_id: item.ingredient_id,
                    name: item.ingredient_name,
                    unit: item.ingredient_unit,
                    total_quantity: requiredQuantity,
                });
            }
        }

        // Convert Map values to array for the response
        const shoppingList = Array.from(aggregatedList.values());

        // Optional: Round quantities for display?
        shoppingList.forEach(item => {
            // Example: Round to 2 decimal places, adjust as needed
            item.total_quantity = Math.round(item.total_quantity * 100) / 100;
        });

        console.log(`[API ShoppingList GET] Aggregated list contains ${shoppingList.length} unique ingredients.`);
        return json({ shoppingList });

    } catch (e: any) {
        if (e.status === 404 || e.status === 403 || e.status === 401 || e.status === 400) {
            throw e;
        }
        console.error(`[API ShoppingList GET] Error generating shopping list for trip ID ${tripIdNum}:`, e);
        throw error(500, `Failed to generate shopping list: ${e.message || 'Unknown error'}`);
    }
};