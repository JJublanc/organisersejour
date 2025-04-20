import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
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
    // Ensure user is authenticated
    if (!locals.user?.authenticated || !locals.user.id) {
        throw redirect(302, '/'); // Redirect if not logged in
    }
    const userId = locals.user.id;

    try {
        const db = platform?.env?.DB;
        if (!db) {
            throw new Error("Database binding not found.");
        }

        // Fetch trips belonging to the current user
        const stmt = db.prepare('SELECT * FROM trips WHERE organiser_id = ? ORDER BY start_date DESC');
        const { results } = await stmt.bind(userId).all<Trip>();

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