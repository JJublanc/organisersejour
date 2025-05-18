import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
// import { getUserFromRequest } from '$lib/auth'; // Assuming auth utilities are in $lib - getUserFromRequest not used
import { getNeonDbUrl, getDbClient } from '$lib/server/db';
import type { User } from '$lib/auth'; // Import User type if not already
import type { TransactionSql } from 'postgres';


export type ActionData = {
    name?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    num_people?: number;
    error?: string;
    message?: string;
    tripId?: number; // Optionally return new trip ID on success
};

export const load: PageServerLoad = async ({ locals, parent }) => {
    // Use parent load function to get user, ensuring consistency
    const { user } = await parent();
    if (!user?.authenticated) {
        throw redirect(302, '/'); 
    }
    return {}; 
};

export const actions: Actions = {
    createTrip: async ({ request, locals, platform }) => {
        let user = locals.user as User | null; // Get user directly from locals
        const authEnabled = platform?.env?.AUTH_ENABLED === 'true';

        if (!authEnabled && !user) {
            user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User (Action)', authenticated: true };
        }

        if (!user?.authenticated || !user.id) {
            return fail(401, { error: 'User not authenticated' } as ActionData);
        }
        const organiserId = user.id;

        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const startDate = formData.get('start_date')?.toString();
        const endDate = formData.get('end_date')?.toString();
        const location = formData.get('location')?.toString() || null;
        const numPeopleStr = formData.get('num_people')?.toString();

        if (!name || !startDate || !endDate || !numPeopleStr) {
            return fail(400, { error: 'Missing required fields', name, startDate, endDate, location, num_people: parseInt(numPeopleStr || '0') } as ActionData);
        }

        const numPeople = parseInt(numPeopleStr);
        if (isNaN(numPeople) || numPeople < 1) {
             return fail(400, { error: 'Invalid number of people', name, startDate, endDate, location, num_people: numPeople } as ActionData);
        }

        if (new Date(endDate) < new Date(startDate)) {
             return fail(400, { error: 'End date cannot be before start date', name, startDate, endDate, location, num_people: numPeople } as ActionData);
        }

        const dbUrl = getNeonDbUrl(platform?.env);
        if (!dbUrl) {
            console.error("[Action createTrip /trips/new] Neon Database URL not found.");
            return fail(500, { error: "Database connection information not found." } as ActionData);
        }
        const sql = getDbClient(dbUrl);

        try {
            // Although it's a single insert, using a transaction is good practice for consistency
            // and if more operations were to be added later (like creating default days/meals).
            const newTrips = await sql<{id: number}[]>`
                INSERT INTO trips (name, start_date, end_date, location, organiser_id, num_people)
                VALUES (${name}, ${startDate}, ${endDate}, ${location}, ${organiserId}, ${numPeople})
                RETURNING id
            `;
            const newTripId = newTrips[0]?.id;

            if (!newTripId) {
                console.error('Failed to create trip or retrieve ID.');
                return fail(500, { error: 'Failed to create trip record.' } as ActionData);
            }
            
            // Instead of just returning a message, redirect to the new trip's page
            // throw redirect(303, `/trips/${newTripId}`);
            // Or, if you want to stay on the page and show a success message:
             return { message: 'Trip created successfully!', success: true, tripId: newTripId } as ActionData;

        } catch (e: any) {
            console.error('Error creating trip:', e);
            if (e.code === '42P01') { // undefined_table for PostgreSQL
                return fail(500, { error: `Database table not found. Please ensure migrations are up to date. Error: ${e.message}`, name, startDate, endDate, location, num_people: numPeople } as ActionData);
            }
            return fail(500, {
                error: `Failed to create trip: ${e.message || 'Unknown error'}`,
                name, startDate, endDate, location, num_people: numPeople
            } as ActionData);
        }
    }
};