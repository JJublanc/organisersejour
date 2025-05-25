import { error, redirect, type ServerLoad, type ServerLoadEvent } from '@sveltejs/kit';
import type { Trip, Ingredient, KitchenTool, ShoppingListItem } from '$lib/types';
import { getNeonDbUrl, getDbClient } from '$lib/server/db';
import type { User } from '$lib/auth';

// --- Define data structures for this page ---
export interface MealComponent {
	id: number; // meal_components.id
	course_type: 'starter' | 'main' | 'dessert' | 'side' | 'extra' | 'breakfast_item';
	recipe_id: number | null;
	ingredient_id: number | null;
	total_quantity: number | null;
	unit: string | null;
	quantity_per_person: number | null;
	notes: string | null;
	display_order: number;
	recipe_name?: string | null;
	ingredient_name?: string | null;
	ingredient_unit?: string | null;
}

export interface Meal {
	id: number;
	type: 'breakfast' | 'lunch' | 'dinner';
	drinks: string | null;
	bread: boolean;
	recipe_components: {
		starter?: MealComponent[];
		main?: MealComponent[];
		dessert?: MealComponent[];
		side?: MealComponent[];
		extra?: MealComponent[];
		breakfast_item?: MealComponent[];
	};
	accompaniments: MealComponent[];
}

export interface TripDay {
    id: number;
    date: string; // YYYY-MM-DD
    meals: Meal[];
}

export interface TripDetailPageData {
    trip: Trip;
    days: TripDay[];
}

// --- Load Function ---
export const load: ServerLoad = async (event: ServerLoadEvent): Promise<TripDetailPageData> => {
    const { params, locals, platform, parent } = event;
    const { tripId } = params;

    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        throw error(500, "Neon Database URL not found.");
    }
    const sql = getDbClient(dbUrl);

    const parentData = await parent();
    let user: User | null = parentData.user as User | null;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';

    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated || !user.id) {
        throw redirect(302, '/trips');
    }
    const userId = user.id;

    if (!tripId || isNaN(parseInt(tripId))) {
         throw error(400, "Invalid Trip ID parameter.");
    }
    const tripIdNum = parseInt(tripId);

    try {
        console.log(`[Trip Detail Load] Fetching trip details for ID: ${tripIdNum}, User: ${userId}`);

        let tripResultRows: Trip[];
        if (authEnabled) {
            tripResultRows = await sql<Trip[]>`SELECT * FROM trips WHERE id = ${tripIdNum} AND organiser_id = ${userId}`;
        } else {
            tripResultRows = await sql<Trip[]>`SELECT * FROM trips WHERE id = ${tripIdNum}`;
        }
        const tripResult = tripResultRows[0];

        if (!tripResult) {
            throw error(404, 'Trip not found or not authorized');
        }

        const daysList = await sql<Omit<TripDay, 'meals'>[]>`
            SELECT id, date FROM trip_days WHERE trip_id = ${tripIdNum} ORDER BY date ASC
        `;

        const daysData: TripDay[] = [];
        if (daysList) {
            for (const day of daysList) {
                const mealsList = await sql<Omit<Meal, 'recipe_components' | 'accompaniments'>[]>`
                    SELECT id, type, drinks, bread FROM meals 
                    WHERE trip_day_id = ${day.id} 
                    ORDER BY CASE type WHEN 'breakfast' THEN 1 WHEN 'lunch' THEN 2 WHEN 'dinner' THEN 3 ELSE 4 END
                `;

                const mealsData: Meal[] = [];
                if (mealsList) {
                    for (const meal of mealsList) {
                        const componentsList = await sql<MealComponent[]>`
                            SELECT
                                mc.id, mc.course_type, mc.recipe_id, mc.ingredient_id,
                                mc.total_quantity, mc.unit, mc.quantity_per_person,
                                mc.notes, mc.display_order,
                                r.name AS recipe_name,
                                i.name AS ingredient_name,
                                mc.unit AS ingredient_unit
                            FROM meal_components mc
                            LEFT JOIN recipes r ON mc.recipe_id = r.id
                            LEFT JOIN ingredients i ON mc.ingredient_id = i.id
                            WHERE mc.meal_id = ${meal.id}
                            ORDER BY mc.display_order ASC, mc.id ASC
                        `;

                        const groupedRecipeComponents: Meal['recipe_components'] = {};
                        const accompanimentsList: MealComponent[] = [];

                        if (componentsList) {
                            for (const comp of componentsList) {
                                if (comp.recipe_id !== null) {
                                    const course = comp.course_type as keyof Meal['recipe_components'];
                                    if (!groupedRecipeComponents[course]) {
                                        groupedRecipeComponents[course] = [];
                                    }
                                    groupedRecipeComponents[course]!.push(comp);
                                } else if (comp.ingredient_id !== null) {
                                    accompanimentsList.push(comp);
                                }
                            }
                        }
                        mealsData.push({
                            ...meal,
                            bread: Boolean(meal.bread),
                            recipe_components: groupedRecipeComponents,
                            accompaniments: accompanimentsList
                        });
                    }
                }
                daysData.push({ ...day, meals: mealsData });
            }
        }

        console.log(`[Trip Detail Load] Successfully fetched trip '${tripResult.name}' with ${daysData.length} days.`);
        return { trip: tripResult, days: daysData };

    } catch (e: any) {
         if (e.status === 404 || e.status === 403 || e.status === 401 || e.status === 400) {
             throw e;
         }
        console.error(`[Trip Detail Load] Error fetching trip details for ID ${tripIdNum}:`, e);
        if (e.code === '42P01') { // undefined_table for PostgreSQL
             console.error(`[Trip Detail Load] Table not found. This might indicate migrations haven't run on Neon for the current environment.`);
             throw error(500, `Database table not found. Please ensure migrations are up to date. Error: ${e.message}`);
        }
        throw error(500, `Failed to load trip details: ${e.message || 'Unknown error'}`);
    }
};