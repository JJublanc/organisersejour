import { error, redirect, type ServerLoad, type ServerLoadEvent } from '@sveltejs/kit'; // Consolidate and use correct types
import type { Trip, Ingredient, KitchenTool } from '$lib/types'; // Import Trip from $lib/types

// --- Define data structures for this page ---

// Structure for a Recipe within a Meal context
export interface MealRecipe extends RecipeCore { // Exported
    // We might add more recipe details later if needed directly in the meal view
}

// Structure for Recipe Ingredients (as fetched for recipes within meals)
export interface MealRecipeIngredient { // Exported
    name: string;
    unit: string;
    quantity: number;
}

// Core Recipe details needed for MealRecipe
export interface RecipeCore { // Exported
    id: number;
    name: string;
    servings: number;
    // Add other core fields if needed for display (e.g., description)
    // description: string | null;
}


// Structure for a Meal
export interface Meal { // Exported
    id: number;
    type: 'breakfast' | 'lunch' | 'dinner';
    drinks: string | null;
    bread: boolean;
    recipes: MealRecipe[]; // Recipes assigned to this meal
}

// Structure for a Trip Day
export interface TripDay { // Exported
    id: number;
    date: string; // YYYY-MM-DD
    meals: Meal[]; // Meals for this day (breakfast, lunch, dinner)
}

// Structure for the data loaded by this page
export interface TripDetailPageData {
    trip: Trip;
    days: TripDay[];
}

// --- Load Function ---

// Use ServerLoad and ServerLoadEvent
export const load: ServerLoad = async (event: ServerLoadEvent): Promise<TripDetailPageData> => {
    const { params, locals, platform } = event; // Destructure here
    const { tripId } = params;
    const db = platform?.env?.DB;

    // --- Authentication Check (similar to /trips/+page.server.ts) ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        console.log("[Trip Detail Load] Auth disabled, creating mock user.");
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated || !user.id) {
        console.error("[Trip Detail Load] User not authenticated.");
        throw redirect(302, '/trips'); // Redirect to trips list if not logged in
    }
    const userId = user.id;
    // --- End Authentication Check ---

    if (!db) {
        console.error("[Trip Detail Load] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }
    if (!tripId || isNaN(parseInt(tripId))) {
         console.error(`[Trip Detail Load] Invalid tripId parameter: ${tripId}`);
         throw error(400, "Invalid Trip ID parameter.");
    }
    const tripIdNum = parseInt(tripId);

    try {
        console.log(`[Trip Detail Load] Fetching trip details for ID: ${tripIdNum}, User: ${userId}`);

        // 1. Fetch the main trip details, ensuring it belongs to the user
        const tripStmt = db.prepare('SELECT * FROM trips WHERE id = ? AND organiser_id = ?');
        const tripResult = await tripStmt.bind(tripIdNum, userId).first<Trip>();

        if (!tripResult) {
            console.warn(`[Trip Detail Load] Trip ID ${tripIdNum} not found for user ${userId}.`);
            throw error(404, 'Trip not found');
        }

        // 2. Fetch trip days associated with this trip
        const daysStmt = db.prepare('SELECT id, date FROM trip_days WHERE trip_id = ? ORDER BY date ASC');
        const { results: daysList } = await daysStmt.bind(tripIdNum).all<Omit<TripDay, 'meals'>>();

        const daysData: TripDay[] = [];
        if (daysList) {
            // Prepare statements outside the loop for efficiency
            const mealsStmt = db.prepare('SELECT id, type, drinks, bread FROM meals WHERE trip_day_id = ? ORDER BY CASE type WHEN \'breakfast\' THEN 1 WHEN \'lunch\' THEN 2 WHEN \'dinner\' THEN 3 ELSE 4 END');
            const mealRecipesStmt = db.prepare(`
                SELECT r.id, r.name, r.servings
                FROM meal_recipes mr
                JOIN recipes r ON mr.recipe_id = r.id
                WHERE mr.meal_id = ?
            `);

            for (const day of daysList) {
                // 3. Fetch meals for the current day
                const { results: mealsList } = await mealsStmt.bind(day.id).all<Omit<Meal, 'recipes'>>();

                const mealsData: Meal[] = [];
                if (mealsList) {
                    for (const meal of mealsList) {
                        // 4. Fetch recipes associated with the current meal
                        const { results: recipesList } = await mealRecipesStmt.bind(meal.id).all<MealRecipe>();

                        mealsData.push({
                            ...meal,
                            // Ensure bread is boolean (D1 returns 0 or 1)
                            bread: Boolean(meal.bread),
                            recipes: recipesList || []
                        });
                    }
                }
                daysData.push({
                    ...day,
                    meals: mealsData
                });
            }
        }

        console.log(`[Trip Detail Load] Successfully fetched trip '${tripResult.name}' with ${daysData.length} days.`);

        return {
            trip: tripResult,
            days: daysData
        };

    } catch (e: any) {
         // Handle specific errors like 404 or re-throw others
         if (e.status === 404) {
             throw e; // Re-throw the 404 error from SvelteKit
         }
        console.error(`[Trip Detail Load] Error fetching trip details for ID ${tripIdNum}:`, e);
        throw error(500, `Failed to load trip details: ${e.message || 'Unknown error'}`);
    }
};