import { json, error, type RequestHandler } from '@sveltejs/kit'; // Import directly from @sveltejs/kit
import type { KitchenTool } from '$lib/types'; // Import the KitchenTool type

// Explicitly type platform using the global App namespace
export const GET: RequestHandler = async ({ platform }: { platform: App.Platform | undefined }) => {
    const db = platform?.env?.DB;
    if (!db) {
        console.error("[API /api/kitchen_tools GET] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        console.log("[API /api/kitchen_tools GET] Fetching all kitchen tools...");

        const stmt = db.prepare('SELECT id, name FROM kitchen_tools ORDER BY name ASC');
        const { results } = await stmt.all<KitchenTool>();

        console.log(`[API /api/kitchen_tools GET] Successfully fetched ${results?.length ?? 0} kitchen tools.`);
        return json({ kitchen_tools: results || [] });

    } catch (e: any) {
        console.error('[API /api/kitchen_tools GET] Error fetching kitchen tools:', e);
        throw error(500, `Failed to fetch kitchen tools: ${e.message || 'Unknown error'}`);
    }
};