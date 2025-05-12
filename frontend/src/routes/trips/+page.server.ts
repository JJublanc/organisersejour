import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { User } from '$lib/auth';
import type { D1PreparedStatement } from '@cloudflare/workers-types';
import type { Trip } from '$lib/types'; // Import Trip from new location

// Trip interface is now defined in $lib/types.ts

// Define the shape of the data loaded for the page
export type TripsPageData = {
    trips: Trip[]; // Use imported Trip type
};

export const load: PageServerLoad = async ({ locals, platform }): Promise<TripsPageData> => {
    console.log("[Trips Load] Starting load function..."); // Log start
    console.log("[Trips Load] locals.user (initial):", locals.user); // Log initial locals.user

    // --- Workaround: Explicitly get/mock user at the start of the load function ---
    let user = locals.user; // Try to get from locals first
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    console.log(`[Trips Load] platform.env.AUTH_ENABLED: ${platform?.env?.AUTH_ENABLED}, authEnabled: ${authEnabled}`);

    if (!authEnabled && !user) {
         console.log("[Trips Load] Auth disabled and no user in locals, creating mock user for load.");
         user = { // Define User type inline or import it
             email: 'dev@example.com',
             id: 'dev-user2', // Use the standard mock user ID
             name: 'Development User (Load)',
             authenticated: true
         };
    }
    console.log("[Trips Load] User object AFTER workaround:", user); // Log user after workaround
    console.log("[Trips Load] User object for load:", user);
    // --- End Workaround ---

    // Ensure user is authenticated
    // Use the 'user' variable we just determined
    if (!user?.authenticated || !user.id) {
        console.error("[Trips Load] User not authenticated or missing ID (checked user variable)."); // Log auth failure
        throw redirect(302, '/'); // Redirect if not logged in
    }
    const userId = user.id; // Use user.id from the determined user

    try {
        // Use DB_PREPROD in preprod, otherwise use DB
        const db = platform?.env?.ENVIRONMENT === 'preprod' ? platform?.env?.DB_PREPROD : platform?.env?.DB;
        if (!db) {
            console.error("[Trips Load] Database binding not found."); // Log DB binding issue
            throw new Error("Database binding not found.");
        }
        console.log("[Trips Load] Database binding found."); // Log DB binding success

        // Fetch trips belonging to the current user
        const stmt = db.prepare('SELECT * FROM trips WHERE organiser_id = ? ORDER BY start_date DESC');
        console.log(`[Trips Load] Fetching trips for organiser_id: ${userId}`); // Log user ID used in query
        const { results } = await stmt.bind(userId).all<Trip>(); // Use imported Trip type
        console.log("[Trips Load] Fetched trips results:", results); // Log fetched results

        return {
            trips: results || [] // Return fetched trips or an empty array
        };

    } catch (error: any) {
        console.error('Error fetching trips:', error);
        // Return empty array or handle error appropriately
        return {
            trips: []
        };
    }
};

// Define the actions for this page
export const actions: Actions = {
    createTrip: async ({ request, locals, platform }) => {
        console.log("--- createTrip action started ---"); // Log start
        console.log("[Action createTrip] locals.user (initial):", locals.user); // Log initial locals.user

        // --- Workaround: Explicitly get/mock user at the start of the action ---
        let user = locals.user; // Try to get from locals first
        const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
        console.log(`[Action createTrip] platform.env.AUTH_ENABLED: ${platform?.env?.AUTH_ENABLED}, authEnabled: ${authEnabled}`);

        if (!authEnabled && !user) {
             console.log("[Action createTrip] Auth disabled and no user in locals, creating mock user for action.");
             user = { // Define User type inline or import it
                 email: 'dev@example.com',
                 id: 'dev-user2', // Use the standard mock user ID
                 name: 'Development User (Action)',
                 authenticated: true
             };
        }
        console.log("[Action createTrip] User object AFTER workaround:", user); // Log user after workaround
        console.log("[Action createTrip] User object for action:", user);
        // --- End Workaround ---

        // Ensure user is authenticated before processing the action
        // Use the 'user' variable we just determined
        if (!user?.authenticated || !user.id) {
            console.error("[Action createTrip] User not authenticated (checked user variable)"); // Log auth failure
            return fail(401, { error: 'User not authenticated' });
        }
        const organiserId = user.id; // Use user.id from the determined user

        const formData = await request.formData();
        console.log("[Action createTrip] Form Data Received:", Object.fromEntries(formData.entries())); // Log form data
        const name = formData.get('name')?.toString();
        const startDate = formData.get('start_date')?.toString();
        const endDate = formData.get('end_date')?.toString();
        const location = formData.get('location')?.toString() || null; // Optional field
        const numPeopleStr = formData.get('num_people')?.toString();

        // --- Basic Validation ---
        if (!name || !startDate || !endDate || !numPeopleStr) {
            console.error("[Action createTrip] Validation failed: Missing required fields"); // Log validation failure
            return fail(400, { error: 'Missing required fields' });
        }

        const numPeople = parseInt(numPeopleStr);
        if (isNaN(numPeople) || numPeople < 1) {
             console.error("[Action createTrip] Validation failed: Invalid number of people"); // Log validation failure
             return fail(400, { error: 'Invalid number of people' });
        }

        if (new Date(endDate) < new Date(startDate)) {
             console.error("[Action createTrip] Validation failed: End date before start date"); // Log validation failure
             return fail(400, { error: 'End date cannot be before start date' });
        }
        console.log("[Action createTrip] Validation passed. Attempting DB insert..."); // Log validation success
        // --- End Validation ---

        try {
            // Use DB_PREPROD in preprod, otherwise use DB
            const db = platform?.env?.ENVIRONMENT === 'preprod' ? platform?.env?.DB_PREPROD : platform?.env?.DB;
            if (!db) {
                console.error("[Action createTrip] Database binding not found."); // Log DB binding issue
                throw new Error("Database binding not found.");
            }
            console.log("[Action createTrip] Database binding found."); // Log DB binding success

            const stmt = db.prepare(
                'INSERT INTO trips (name, start_date, end_date, location, organiser_id, num_people) VALUES (?, ?, ?, ?, ?, ?)'
            );
            const tripInsertInfo = await stmt.bind(name, startDate, endDate, location, organiserId, numPeople).run();
            console.log("[Action createTrip] Trip Insert Result:", tripInsertInfo);

            // --- Start: Add Trip Days and Meals ---
            if (!tripInsertInfo.success || tripInsertInfo.meta?.last_row_id === undefined) {
                console.error("[Action createTrip] Failed to insert trip or get last_row_id.", tripInsertInfo);
                return fail(500, { error: 'Failed to create trip record.' });
            }
            const newTripId = tripInsertInfo.meta.last_row_id;
            console.log(`[Action createTrip] Trip created with ID: ${newTripId}. Now adding days and meals.`);

            try {
                const start = new Date(startDate);
                const end = new Date(endDate);
                const insertDayStmt = db.prepare('INSERT INTO trip_days (trip_id, date) VALUES (?, ?)');
                const insertMealStmt = db.prepare('INSERT INTO meals (trip_day_id, type) VALUES (?, ?)');

                // Loop through each day of the trip
                let currentDate = new Date(start);
                // Ensure loop includes the end date
                while (currentDate <= end) {
                    const dateString = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                    console.log(`[Action createTrip] Processing date: ${dateString} for trip ${newTripId}`);

                    // Insert Trip Day
                    const dayInsertInfo = await insertDayStmt.bind(newTripId, dateString).run();
                    if (!dayInsertInfo.success || dayInsertInfo.meta?.last_row_id === undefined) {
                        console.error(`[Action createTrip] Failed to insert trip_day for date ${dateString}, tripId ${newTripId}. Skipping meals for this day.`, dayInsertInfo);
                    } else {
                        const newTripDayId = dayInsertInfo.meta.last_row_id;
                        console.log(`[Action createTrip] Inserted trip_day ID: ${newTripDayId} for date ${dateString}`);

                        // Insert Meals for the Trip Day (using batch for meals of a single day is efficient)
                        const mealTypes = ['breakfast', 'lunch', 'dinner'];
                        const mealInserts: D1PreparedStatement[] = mealTypes.map(type =>
                            insertMealStmt.bind(newTripDayId, type)
                        );
                        try {
                             await db.batch(mealInserts);
                             console.log(`[Action createTrip] Successfully added default meals for day ${dateString} (Day ID: ${newTripDayId}).`);
                        } catch (mealBatchError: any) {
                             console.error(`[Action createTrip] Failed to batch insert meals for day ${dateString} (Day ID: ${newTripDayId}):`, mealBatchError);
                             // Decide if this is critical enough to fail the whole operation
                        }
                    }

                    // Move to the next day
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                console.log(`[Action createTrip] Finished processing days/meals for trip ${newTripId}.`);

            } catch (dayMealError: any) {
                 // Log the error, but the trip itself was created.
                 // Consider more robust error handling / rollback if needed.
                 console.error(`[Action createTrip] Error creating trip days/meals for trip ${newTripId}:`, dayMealError);
                 // Return success for the trip creation, but maybe add a warning?
                 // For now, just log and proceed to return success for trip creation.
            }
            // --- End: Add Trip Days and Meals ---

            return { success: true, message: 'Séjour créé avec succès!' }; // Indicate success explicitly

        } catch (dbError: any) {
            console.error('[Action createTrip] Error creating trip:', dbError);
            return fail(500, {
                error: `Failed to create trip: ${dbError.message || 'Unknown error'}`
            });
        }
    }
};