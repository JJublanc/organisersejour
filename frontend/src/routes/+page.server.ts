import type { PageServerLoad } from './$types';
// Remove unused imports: import { fail, redirect } from '@sveltejs/kit';
// Remove unused imports: import type { Actions } from './$types';

// Remove ActionData type definition
/*
export type ActionData = {
    name?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    num_people?: number;
    error?: string;
    message?: string;
};
*/

export const load: PageServerLoad = async ({ fetch, locals }) => {
  // Fetch the message from the /api/hello endpoint
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
    if (error instanceof TypeError && error.message.includes('fetch')) {
       message = 'Error: Fetch failed. Check server configuration.';
    } else {
      message = 'Error: Could not connect to API.';
    }
  }

  // Return both the message and the user info from locals
  // (locals.user is populated by +layout.server.ts)
  return {
    message,
    user: locals.user
  };
};

// Remove the entire actions export
/*
export const actions: Actions = {
    createTrip: async ({ request, locals, platform }) => {
        // ... (removed action code) ...
    }
};
*/