import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Define the shape of data that might be returned from the action
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

export const load: PageServerLoad = async ({ fetch, locals }) => {
  // Fetch the message from the /api/hello endpoint
  // The 'fetch' provided here automatically handles credentials and relative paths
  let message;
  
  try {
    const response = await fetch('/api/hello');
    
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}: ${await response.text()}`);
      message = `Error: API request failed (${response.status})`;
    } else {
      const data = await response.json();
      message = data?.message ?? 'No message returned from API';
    }
  } catch (error) {
    console.error("Failed to fetch from /api/hello:", error);
    // Check if error is a TypeError related to fetch, common in SSR if not configured right
    if (error instanceof TypeError && error.message.includes('fetch')) {
       message = 'Error: Fetch failed. Check server configuration.';
    } else {
      message = 'Error: Could not connect to API.';
    }
  }
  
  // Return both the message and the user info from locals
  return {
    message,
    user: locals.user
  };
};

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
                 id: 'dev-user-action', // Use a slightly different ID for clarity
                 name: 'Development User (Action)',
                 authenticated: true
             };
        }
        console.log("[Action createTrip] User object for action:", user);
        // --- End Workaround ---

        // Ensure user is authenticated before processing the action
        // Use the 'user' variable we just determined
        if (!user?.authenticated || !user.id) {
            console.error("User not authenticated for createTrip (checked user variable)"); // Log auth failure
            return fail(401, { error: 'User not authenticated' });
        }
        const organiserId = user.id; // Use user.id from the determined user

        const formData = await request.formData();
        console.log("Form Data Received:", Object.fromEntries(formData.entries())); // Log form data
        const name = formData.get('name')?.toString();
        const startDate = formData.get('start_date')?.toString();
        const endDate = formData.get('end_date')?.toString();
        const location = formData.get('location')?.toString() || null; // Optional field
        const numPeopleStr = formData.get('num_people')?.toString();

        // --- Basic Validation ---
        if (!name || !startDate || !endDate || !numPeopleStr) {
            console.error("Validation failed: Missing required fields"); // Log validation failure
            return fail(400, { error: 'Missing required fields', name, startDate, endDate, location, num_people: parseInt(numPeopleStr || '1') });
        }

        const numPeople = parseInt(numPeopleStr);
        if (isNaN(numPeople) || numPeople < 1) {
             console.error("Validation failed: Invalid number of people"); // Log validation failure
             return fail(400, { error: 'Invalid number of people', name, startDate, endDate, location, num_people: 1 });
        }

        if (new Date(endDate) < new Date(startDate)) {
             console.error("Validation failed: End date before start date"); // Log validation failure
             return fail(400, { error: 'End date cannot be before start date', name, startDate, endDate, location, num_people: numPeople });
        }
        console.log("Validation passed. Attempting DB insert..."); // Log validation success
        // --- End Validation ---

        try {
            const db = platform?.env?.DB;
            if (!db) {
                console.error("Database binding 'DB' not found in platform.env"); // Log DB binding issue
                throw new Error("Database binding not found.");
            }
            console.log("Database binding 'DB' found."); // Log DB binding success

            const stmt = db.prepare(
                'INSERT INTO trips (name, start_date, end_date, location, organiser_id, num_people) VALUES (?, ?, ?, ?, ?, ?)'
            );
            const info = await stmt.bind(name, startDate, endDate, location, organiserId, numPeople).run();
            console.log("DB Insert Result:", info); // Log DB insert result

            return { message: 'Séjour créé avec succès!' };

        } catch (error: any) {
            console.error('Error creating trip:', error);
            return fail(500, {
                error: `Failed to create trip: ${error.message || 'Unknown error'}`,
                name, startDate, endDate, location, num_people: numPeople
            });
        }
    }
};