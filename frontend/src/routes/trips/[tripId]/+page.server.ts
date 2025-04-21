import { error, redirect, type ServerLoad, type ServerLoadEvent } from '@sveltejs/kit';
import type { Trip, Ingredient, KitchenTool, ShoppingListItem } from '$lib/types'; // Import shared types

// --- Define data structures for this page ---

// Structure for a component within a meal (recipe or ingredient)
export interface MealComponent {
    id: number; // meal_components.id
    course_type: 'starter' | 'main' | 'dessert' | 'side' | 'extra' | 'breakfast_item';
    recipe_id: number | null;
    ingredient_id: number | null;
    quantity: number | null; // Only for direct ingredients
    notes: string | null;
    display_order: number;
    // Include names for display
    recipe_name?: string | null;
    ingredient_name?: string | null;
    ingredient_unit?: string | null;
}

// Structure for a Meal, now containing components grouped by course
export interface Meal {
    id: number;
    type: 'breakfast' | 'lunch' | 'dinner'; // breakfast, lunch, dinner
    drinks: string | null;
    bread: boolean;
    // Components grouped by course type for easier rendering
    components: {
        starter?: MealComponent[];
        main?: MealComponent[];
        dessert?: MealComponent[];
        side?: MealComponent[];
        extra?: MealComponent[];
        breakfast_item?: MealComponent[];
        // Add other course types if needed
    };
}

// Structure for a Trip Day
export interface TripDay {
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

export const load: ServerLoad = async (event: ServerLoadEvent): Promise<TripDetailPageData> => {
    const { params, locals, platform } = event;
    const { tripId } = params;
    const db = platform?.env?.DB;

    // --- Authentication Check ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated || !user.id) {
        throw redirect(302, '/trips');
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
        console.log(`[Trip Detail Load] Fetching trip details for ID: ${tripIdNum}, User: ${userId}`);

        // 1. Fetch the main trip details, ensuring it belongs to the user
        const tripStmt = db.prepare('SELECT * FROM trips WHERE id = ? AND organiser_id = ?');
        const tripResult = await tripStmt.bind(tripIdNum, userId).first<Trip>();

        if (!tripResult) {
            throw error(404, 'Trip not found');
        }

        // 2. Fetch trip days associated with this trip
        const daysStmt = db.prepare('SELECT id, date FROM trip_days WHERE trip_id = ? ORDER BY date ASC');
        const { results: daysList } = await daysStmt.bind(tripIdNum).all<Omit<TripDay, 'meals'>>();

        const daysData: TripDay[] = [];
        if (daysList) {
            // Prepare statements outside the loop
            const mealsStmt = db.prepare('SELECT id, type, drinks, bread FROM meals WHERE trip_day_id = ? ORDER BY CASE type WHEN \'breakfast\' THEN 1 WHEN \'lunch\' THEN 2 WHEN \'dinner\' THEN 3 ELSE 4 END');
            // Fetch all components for a meal, joining recipe/ingredient names
            const componentsStmt = db.prepare(`
                SELECT
                    mc.id, mc.course_type, mc.recipe_id, mc.ingredient_id, mc.quantity, mc.notes, mc.display_order,
                    r.name AS recipe_name,
                    i.name AS ingredient_name, i.unit AS ingredient_unit
                FROM meal_components mc
                LEFT JOIN recipes r ON mc.recipe_id = r.id
                LEFT JOIN ingredients i ON mc.ingredient_id = i.id
                WHERE mc.meal_id = ?
                ORDER BY mc.display_order ASC, mc.id ASC
            `);

            for (const day of daysList) {
                // 3. Fetch meals for the current day
                const { results: mealsList } = await mealsStmt.bind(day.id).all<Omit<Meal, 'components'>>();

                const mealsData: Meal[] = [];
                if (mealsList) {
                    for (const meal of mealsList) {
                        // 4. Fetch components for the current meal
                        const { results: componentsList } = await componentsStmt.bind(meal.id).all<MealComponent>();

                        // Group components by course_type
                        const groupedComponents: Meal['components'] = {};
                        if (componentsList) {
                            for (const comp of componentsList) {
                                const course = comp.course_type as keyof Meal['components']; // Type assertion
                                if (!groupedComponents[course]) {
                                    groupedComponents[course] = [];
                                }
                                groupedComponents[course]!.push(comp); // Add to the group
                            }
                        }

                        mealsData.push({
                            ...meal,
                            bread: Boolean(meal.bread),
                            components: groupedComponents // Assign the grouped components
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
         if (e.status === 404 || e.status === 403 || e.status === 401 || e.status === 400) {
             throw e;
         }
        console.error(`[Trip Detail Load] Error fetching trip details for ID ${tripIdNum}:`, e);
        throw error(500, `Failed to load trip details: ${e.message || 'Unknown error'}`);
    }
};