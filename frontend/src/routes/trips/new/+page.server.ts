import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getUserFromRequest } from '$lib/auth'; // Assuming auth utilities are in $lib

// Define the shape of ALL data that might be returned from the action,
// including success message and fields for repopulation on failure.
export type ActionData = {
    // Fields for repopulation on error
    name?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    num_people?: number; // Use num_people to match form field name
    // Status fields
    error?: string;
    message?: string;
};

// Ensure the user is logged in to access this page
export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user?.authenticated) {
        throw redirect(302, '/'); // Redirect to login or home if not authenticated
    }
    return {}; // No specific data needed on load, just auth check
};

export const actions: Actions = {
    // Remove explicit Promise<ActionData> return type, let TS infer it.
    // The inferred type will be a union including ActionFailure<...> and the success type.
    default: async ({ request, locals, platform }) => {
        // Ensure user is authenticated before processing the action
        if (!locals.user?.authenticated || !locals.user.id) {
            // fail() needs to return properties matching ActionData or be ignored by the form
            // For simplicity, we'll just return the error message.
            // The form can access submitted values via form?.<field_name> if needed.
            return fail(401, { error: 'User not authenticated' });
        }
        const organiserId = locals.user.id;

        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const startDate = formData.get('start_date')?.toString();
        const endDate = formData.get('end_date')?.toString();
        const location = formData.get('location')?.toString() || null; // Optional field
        const numPeopleStr = formData.get('num_people')?.toString();

        // --- Basic Validation ---
        if (!name || !startDate || !endDate || !numPeopleStr) {
            return fail(400, { error: 'Missing required fields', name, startDate, endDate, location, num_people: parseInt(numPeopleStr || '1') });
        }

        const numPeople = parseInt(numPeopleStr);
        if (isNaN(numPeople) || numPeople < 1) {
             return fail(400, { error: 'Invalid number of people', name, startDate, endDate, location, num_people: 1 });
        }

        if (new Date(endDate) < new Date(startDate)) {
             // Fix typo: num_people -> numPeople
             return fail(400, { error: 'End date cannot be before start date', name, startDate, endDate, location, num_people: numPeople });
        }
        // --- End Validation ---

        try {
            const db = platform?.env?.DB;
            if (!db) {
                throw new Error("Database binding not found.");
            }

            const stmt = db.prepare(
                'INSERT INTO trips (name, start_date, end_date, location, organiser_id, num_people) VALUES (?, ?, ?, ?, ?, ?)'
            );
            await stmt.bind(name, startDate, endDate, location, organiserId, numPeople).run();

            // Optionally, redirect to a page showing the new trip or a list of trips
            // For now, just return a success message
            // throw redirect(303, `/trips`); // Example redirect

             return { message: 'Trip created successfully!' };

        } catch (error: any) {
            console.error('Error creating trip:', error);
            return fail(500, {
                error: `Failed to create trip: ${error.message || 'Unknown error'}`,
                name, startDate, endDate, location, num_people: numPeople
            });
        }
    }
};