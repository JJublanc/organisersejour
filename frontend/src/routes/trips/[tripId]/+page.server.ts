import { error, redirect, type ServerLoad, type ServerLoadEvent } from '@sveltejs/kit';
import type { Trip, Ingredient, KitchenTool, ShoppingListItem } from '$lib/types'; // Import shared types

// --- Define data structures for this page ---

// Structure for a component within a meal (recipe or ingredient) - Updated for new schema
export interface MealComponent {
	id: number; // meal_components.id
	course_type: 'starter' | 'main' | 'dessert' | 'side' | 'extra' | 'breakfast_item';
	recipe_id: number | null;
	ingredient_id: number | null;
	total_quantity: number | null; // Renamed from quantity, used for non-direct ingredients or pre-calculated totals
	unit: string | null; // Unit for direct ingredients
	quantity_per_person: number | null; // Quantity per person for direct ingredients
	notes: string | null;
	display_order: number;
	// Include names for display
	recipe_name?: string | null;
	ingredient_name?: string | null;
	// ingredient_unit is now directly available as 'unit' for direct ingredients
	// Keep ingredient_unit for potential backward compatibility or display logic if needed, but prefer 'unit'
	ingredient_unit?: string | null; // This might be derived from 'unit' or fetched separately if needed elsewhere
}

// Structure for a Meal, separating recipe components and accompaniments
export interface Meal {
	id: number;
	type: 'breakfast' | 'lunch' | 'dinner';
	drinks: string | null; // This might become redundant if drinks are added as accompaniments
	bread: boolean; // This might become redundant if bread is added as an accompaniment
	// Recipe components grouped by course type
	recipe_components: {
		starter?: MealComponent[];
		main?: MealComponent[];
		dessert?: MealComponent[];
		side?: MealComponent[]; // Keep side? Or merge into extra? Let's keep for now.
		extra?: MealComponent[];
		breakfast_item?: MealComponent[];
	};
	// Direct ingredients treated as accompaniments/drinks
	accompaniments: MealComponent[];
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
     mc.id, mc.course_type, mc.recipe_id, mc.ingredient_id,
     mc.total_quantity, mc.unit, mc.quantity_per_person, -- Use new columns
     mc.notes, mc.display_order,
     r.name AS recipe_name,
     i.name AS ingredient_name,
     mc.unit AS ingredient_unit -- Alias mc.unit also as ingredient_unit for potential compatibility
    FROM meal_components mc
                LEFT JOIN recipes r ON mc.recipe_id = r.id
                LEFT JOIN ingredients i ON mc.ingredient_id = i.id
                WHERE mc.meal_id = ?
                ORDER BY mc.display_order ASC, mc.id ASC
            `);

            for (const day of daysList) {
    // 3. Fetch meals for the current day
    // Adjust the type hint for the fetched meal data
    const { results: mealsList } = await mealsStmt.bind(day.id).all<Omit<Meal, 'recipe_components' | 'accompaniments'>>();

    const mealsData: Meal[] = [];
    if (mealsList) {
     for (const meal of mealsList) {
      // 4. Fetch components for the current meal
      const { results: componentsList } = await componentsStmt.bind(meal.id).all<MealComponent>();

      // Separate recipe components (grouped) and accompaniments (flat list)
      const groupedRecipeComponents: Meal['recipe_components'] = {};
      const accompanimentsList: MealComponent[] = [];

      if (componentsList) {
       for (const comp of componentsList) {
        if (comp.recipe_id !== null) {
         // It's a recipe component, group by course
         const course = comp.course_type as keyof Meal['recipe_components'];
         if (!groupedRecipeComponents[course]) {
          groupedRecipeComponents[course] = [];
         }
         groupedRecipeComponents[course]!.push(comp);
        } else if (comp.ingredient_id !== null) {
         // It's a direct ingredient, add to accompaniments list
         accompanimentsList.push(comp);
        }
        // Ignore components that are neither (shouldn't happen with DB constraints)
       }
      }

      mealsData.push({
       ...meal,
       bread: Boolean(meal.bread), // Keep for now, might remove later
       recipe_components: groupedRecipeComponents, // Assign grouped recipes
       accompaniments: accompanimentsList // Assign flat list of accompaniments
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