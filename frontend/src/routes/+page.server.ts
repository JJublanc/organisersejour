import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  // Fetch the message from the /api/hello endpoint
  // The 'fetch' provided here automatically handles credentials and relative paths
  try {
    const response = await fetch('/api/hello');
    
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}: ${await response.text()}`);
      return { message: `Error: API request failed (${response.status})` };
    }
    
    const data = await response.json();
    return {
      message: data?.message ?? 'No message returned from API',
    };
  } catch (error) {
    console.error("Failed to fetch from /api/hello:", error);
    // Check if error is a TypeError related to fetch, common in SSR if not configured right
    if (error instanceof TypeError && error.message.includes('fetch')) {
       return { message: 'Error: Fetch failed. Check server configuration.' };
    }
    return { message: 'Error: Could not connect to API.' };
  }
};