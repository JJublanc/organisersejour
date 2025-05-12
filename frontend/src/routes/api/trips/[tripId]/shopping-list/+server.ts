import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { Trip, ShoppingListItem } from '$lib/types'; // Import shared types

// Define structure for recipe ingredients needed for calculation
interface RecipeIngredientInfo {
    ingredient_id: number;
    ingredient_name: string;
    ingredient_unit: string;
    ingredient_type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre'; // Use specific union type
    quantity: number; // Quantity per base serving of the recipe
    recipe_servings: number; // Base servings for the recipe
}

// Define structure for direct ingredients from meal_components
interface DirectIngredientInfo {
     ingredient_id: number;
     ingredient_name: string;
     ingredient_unit: string;
     ingredient_type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre'; // Use specific union type
     quantity: number; // Quantity specified directly in meal_components (assumed for whole group)
}

export const GET: RequestHandler = async ({ params, locals, platform }) => {
    const { tripId } = params;
    // Use DB_PREPROD in preprod, otherwise use DB
    const db = platform?.env?.ENVIRONMENT === 'preprod' ? platform?.env?.DB_PREPROD : platform?.env?.DB;

    // --- Authentication Check ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user2', name: 'Development User', authenticated: true };
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

        // --- Aggregation Map ---
        const aggregatedList: Map<number, ShoppingListItem> = new Map();

        // 2. Fetch ingredients from RECIPES linked via meal_components
        const recipeIngredientsQuery = `
            SELECT
                ri.ingredient_id,
                i.name AS ingredient_name,
                i.unit AS ingredient_unit,
                i.type AS ingredient_type,
                ri.quantity,
                r.servings AS recipe_servings
            FROM trips t
            JOIN trip_days td ON t.id = td.trip_id
            JOIN meals m ON td.id = m.trip_day_id
            JOIN meal_components mc ON m.id = mc.meal_id
            JOIN recipes r ON mc.recipe_id = r.id             -- Join recipes
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id -- Join recipe ingredients
            JOIN ingredients i ON ri.ingredient_id = i.id     -- Join ingredients table
            WHERE t.id = ? AND t.organiser_id = ? AND mc.recipe_id IS NOT NULL
        `;
        const recipeIngredientsStmt = db.prepare(recipeIngredientsQuery);
        const { results: recipeIngredients } = await recipeIngredientsStmt.bind(tripIdNum, userId).all<RecipeIngredientInfo>();

        if (recipeIngredients) {
            console.log(`[API ShoppingList GET] Found ${recipeIngredients.length} ingredient instances from recipes.`);
            for (const item of recipeIngredients) {
                // Calculate scaling factor
                const servings = item.recipe_servings > 0 ? item.recipe_servings : 1;
                const scaleFactor = numPeople / servings;
                const requiredQuantity = item.quantity * scaleFactor;

                const existingItem = aggregatedList.get(item.ingredient_id);
                if (existingItem) {
                    if (existingItem.unit !== item.ingredient_unit) console.warn(`Unit mismatch for ingredient ID ${item.ingredient_id}`);
                    existingItem.total_quantity += requiredQuantity;
                } else {
                    aggregatedList.set(item.ingredient_id, {
                        ingredient_id: item.ingredient_id,
                        name: item.ingredient_name,
                        unit: item.ingredient_unit,
                        total_quantity: requiredQuantity,
                        type: item.ingredient_type,
                    });
                }
            }
        }

        // 3. Fetch DIRECT ingredients linked via meal_components
        const directIngredientsQuery = `
            SELECT
                mc.ingredient_id,
                i.name AS ingredient_name,
                mc.unit AS ingredient_unit,
                i.type AS ingredient_type,
                mc.quantity_per_person * ? AS quantity -- Calculate total quantity based on number of people
            FROM trips t
            JOIN trip_days td ON t.id = td.trip_id
            JOIN meals m ON td.id = m.trip_day_id
            JOIN meal_components mc ON m.id = mc.meal_id
            JOIN ingredients i ON mc.ingredient_id = i.id -- Join ingredients table
            WHERE t.id = ? AND t.organiser_id = ? AND mc.ingredient_id IS NOT NULL
        `;
        const directIngredientsStmt = db.prepare(directIngredientsQuery);
        const { results: directIngredients } = await directIngredientsStmt.bind(numPeople, tripIdNum, userId).all<DirectIngredientInfo>();

        if (directIngredients) {
             console.log(`[API ShoppingList GET] Found ${directIngredients.length} direct ingredient instances.`);
             for (const item of directIngredients) {
                 const existingItem = aggregatedList.get(item.ingredient_id);
                 if (existingItem) {
                     if (existingItem.unit !== item.ingredient_unit) console.warn(`Unit mismatch for ingredient ID ${item.ingredient_id}`);
                     // Add the quantity directly (it's assumed to be for the whole group already)
                     existingItem.total_quantity += item.quantity;
                 } else {
                     aggregatedList.set(item.ingredient_id, {
                         ingredient_id: item.ingredient_id,
                         name: item.ingredient_name,
                         unit: item.ingredient_unit,
                         total_quantity: item.quantity, // Use direct quantity
                         type: item.ingredient_type,
                     });
                 }
             }
        }

        // 4. Final Processing
        if (aggregatedList.size === 0) {
            console.log(`[API ShoppingList GET] No ingredients found for trip ${tripIdNum}.`);
            return json({ shoppingList: [] });
        }

        // Convert Map values to array
        const shoppingList = Array.from(aggregatedList.values());

        // Optional: Round quantities
        shoppingList.forEach(item => {
            item.total_quantity = Math.round(item.total_quantity * 100) / 100;
        });

        // Optional: Sort list alphabetically
        shoppingList.sort((a, b) => a.name.localeCompare(b.name));

        // Log type distribution in shopping list for validation
        if (shoppingList.length > 0) {
            const typeDistribution = shoppingList.reduce((acc, item) => {
                acc[item.type] = (acc[item.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            console.log(`[API ShoppingList GET] Type distribution: ${JSON.stringify(typeDistribution)}`);
        }
        
        console.log(`[API ShoppingList GET] Aggregated list contains ${shoppingList.length} unique ingredients.`);
        return json({ shoppingList });

    } catch (e: any) {
        if (e.status >= 400 && e.status < 500) {
            throw e;
        }
        console.error(`[API ShoppingList GET] Error generating shopping list for trip ID ${tripIdNum}:`, e);
        throw error(500, `Failed to generate shopping list: ${e.message || 'Unknown error'}`);
    }
};