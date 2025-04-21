import { json, error, type RequestHandler } from '@sveltejs/kit'; // Consolidate imports
import type { Ingredient } from '$lib/types'; // Import the Ingredient type

// Explicitly type platform using the global App namespace
export const GET: RequestHandler = async ({ platform }: { platform: App.Platform | undefined }) => {
    const db = platform?.env?.DB;
    if (!db) {
        console.error("[API /api/ingredients GET] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        console.log("[API /api/ingredients GET] Fetching all ingredients...");

        const stmt = db.prepare('SELECT id, name, unit FROM ingredients ORDER BY name ASC');
        const { results } = await stmt.all<Ingredient>();

        console.log(`[API /api/ingredients GET] Successfully fetched ${results?.length ?? 0} ingredients.`);
        return json({ ingredients: results || [] });

    } catch (e: any) {
        console.error('[API /api/ingredients GET] Error fetching ingredients:', e);
        throw error(500, `Failed to fetch ingredients: ${e.message || 'Unknown error'}`);
    }
};