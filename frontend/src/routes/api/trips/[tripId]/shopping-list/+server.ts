import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { ShoppingListItem } from '$lib/types'; // Trip type not directly used here
import { getNeonDbUrl, getDbClient } from '$lib/server/db';

// Define structure for recipe ingredients needed for calculation
interface RecipeIngredientInfo {
    ingredient_id: number;
    ingredient_name: string;
    ingredient_unit: string;
    ingredient_type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre';
    quantity: number; // Quantity per base serving of the recipe
    recipe_servings: number; // Base servings for the recipe
}

// Define structure for direct ingredients from meal_components
interface DirectIngredientInfo {
     ingredient_id: number;
     ingredient_name: string;
     ingredient_unit: string;
     ingredient_type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre';
     quantity: number; // Total quantity for the group (calculated based on num_people)
}

export const GET: RequestHandler = async ({ params, locals, platform }) => {
    const { tripId } = params;
    const dbUrl = getNeonDbUrl(platform?.env);

    if (!dbUrl) {
        console.error("[API ShoppingList GET] Neon Database URL not found for environment.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);

    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated || !user.id) {
        throw error(401, 'User not authenticated');
    }
    const userId = user.id;

    if (!tripId || isNaN(parseInt(tripId))) {
        throw error(400, "Invalid Trip ID parameter.");
    }
    const tripIdNum = parseInt(tripId);

    try {
        console.log(`[API ShoppingList GET] Generating shopping list for trip ID: ${tripIdNum}, User: ${userId}`);

        const tripInfos = await sql<{ num_people: number; organiser_id: string }[]>`
            SELECT num_people, organiser_id FROM trips WHERE id = ${tripIdNum}
        `;
        const tripInfo = tripInfos[0];

        if (!tripInfo) {
            throw error(404, 'Trip not found');
        }
        if (tripInfo.organiser_id !== userId) {
            throw error(403, 'Forbidden: You do not own this trip.');
        }
        const numPeople = tripInfo.num_people;
        console.log(`[API ShoppingList GET] Trip found. Attendees: ${numPeople}`);

        const aggregatedList: Map<number, ShoppingListItem> = new Map();

        const recipeIngredients = await sql<RecipeIngredientInfo[]>`
            SELECT
                ri.ingredient_id,
                COALESCE(i.french_name, i.name) AS ingredient_name,
                i.unit AS ingredient_unit,
                i.type AS ingredient_type,
                ri.quantity,
                r.servings AS recipe_servings
            FROM trips t
            JOIN trip_days td ON t.id = td.trip_id
            JOIN meals m ON td.id = m.trip_day_id
            JOIN meal_components mc ON m.id = mc.meal_id
            JOIN recipes r ON mc.recipe_id = r.id
            JOIN recipe_ingredients ri ON r.id = ri.recipe_id
            JOIN ingredients i ON ri.ingredient_id = i.id
            WHERE t.id = ${tripIdNum} AND t.organiser_id = ${userId} AND mc.recipe_id IS NOT NULL
        `;

        if (recipeIngredients) {
            console.log(`[API ShoppingList GET] Found ${recipeIngredients.length} ingredient instances from recipes.`);
            for (const item of recipeIngredients) {
                const servings = item.recipe_servings > 0 ? item.recipe_servings : 1;
                const scaleFactor = numPeople / servings;
                const requiredQuantity = item.quantity * scaleFactor;

                const existingItem = aggregatedList.get(item.ingredient_id);
                if (existingItem) {
                    if (existingItem.unit !== item.ingredient_unit) console.warn(`Unit mismatch for ingredient ID ${item.ingredient_id}: ${existingItem.unit} vs ${item.ingredient_unit}`);
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

        const directIngredients = await sql<DirectIngredientInfo[]>`
            SELECT
                mc.ingredient_id,
                COALESCE(i.french_name, i.name) AS ingredient_name,
                mc.unit AS ingredient_unit,
                i.type AS ingredient_type,
                mc.quantity_per_person * ${numPeople} AS quantity
            FROM trips t
            JOIN trip_days td ON t.id = td.trip_id
            JOIN meals m ON td.id = m.trip_day_id
            JOIN meal_components mc ON m.id = mc.meal_id
            JOIN ingredients i ON mc.ingredient_id = i.id
            WHERE t.id = ${tripIdNum} AND t.organiser_id = ${userId} AND mc.ingredient_id IS NOT NULL
        `;

        if (directIngredients) {
             console.log(`[API ShoppingList GET] Found ${directIngredients.length} direct ingredient instances.`);
             for (const item of directIngredients) {
                 const existingItem = aggregatedList.get(item.ingredient_id);
                 if (existingItem) {
                     if (existingItem.unit !== item.ingredient_unit) console.warn(`Unit mismatch for ingredient ID ${item.ingredient_id}: ${existingItem.unit} vs ${item.ingredient_unit}`);
                     existingItem.total_quantity += item.quantity;
                 } else {
                     aggregatedList.set(item.ingredient_id, {
                         ingredient_id: item.ingredient_id,
                         name: item.ingredient_name,
                         unit: item.ingredient_unit,
                         total_quantity: item.quantity,
                         type: item.ingredient_type,
                     });
                 }
             }
        }

        if (aggregatedList.size === 0) {
            console.log(`[API ShoppingList GET] No ingredients found for trip ${tripIdNum}.`);
            return json({ shoppingList: [] });
        }

        const shoppingList = Array.from(aggregatedList.values());
        shoppingList.forEach(item => {
            item.total_quantity = Math.round(item.total_quantity * 100) / 100;
        });
        shoppingList.sort((a, b) => a.name.localeCompare(b.name));

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