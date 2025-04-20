import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { User } from '$lib/auth'; // Import User type if needed elsewhere

// Define the structure of a Trip object based on the database schema
export interface Trip {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    location: string | null;
    organiser_id: string;
    num_people: number;
}

// Define the shape of the data loaded for the page
export type TripsPageData = {
    trips: Trip[];
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
             id: 'dev-user', // Use the standard mock user ID
             name: 'Development User (Load)',
             authenticated: true
         };
    }
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
        const db = platform?.env?.DB;
        if (!db) {
            console.error("[Trips Load] Database binding 'DB' not found."); // Log DB binding issue
            throw new Error("Database binding not found.");
        }
        console.log("[Trips Load] Database binding 'DB' found."); // Log DB binding success

        // Fetch trips belonging to the current user
        const stmt = db.prepare('SELECT * FROM trips WHERE organiser_id = ? ORDER BY start_date DESC');
        console.log(`[Trips Load] Fetching trips for organiser_id: ${userId}`); // Log user ID used in query
        const { results } = await stmt.bind(userId).all<Trip>();
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
        
        // --- Workaround: Explicitly get/mock user at the start of the action ---
        let user = locals.user; // Try to get from locals first
        const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
        console.log(`[Action createTrip] platform.env.AUTH_ENABLED: ${platform?.env?.AUTH_ENABLED}, authEnabled: ${authEnabled}`);

        if (!authEnabled && !user) {
             console.log("[Action createTrip] Auth disabled and no user in locals, creating mock user for action.");
             user = { // Define User type inline or import it
                 email: 'dev@example.com',
                 id: 'dev-user', // Use the standard mock user ID
                 name: 'Development User (Action)',
                 authenticated: true
             };
        }
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
            const db = platform?.env?.DB;
            if (!db) {
                console.error("[Action createTrip] Database binding 'DB' not found in platform.env"); // Log DB binding issue
                throw new Error("Database binding not found.");
            }
            console.log("[Action createTrip] Database binding 'DB' found."); // Log DB binding success

            const stmt = db.prepare(
                'INSERT INTO trips (name, start_date, end_date, location, organiser_id, num_people) VALUES (?, ?, ?, ?, ?, ?)'
            );
            const info = await stmt.bind(name, startDate, endDate, location, organiserId, numPeople).run();
            console.log("[Action createTrip] DB Insert Result:", info); // Log DB insert result

            return { message: 'Séjour créé avec succès!' };

        } catch (error: any) {
            console.error('[Action createTrip] Error creating trip:', error);
            return fail(500, {
                error: `Failed to create trip: ${error.message || 'Unknown error'}`
            });
        }
    }
};