import { json, error, type RequestHandler } from '@sveltejs/kit'; // Import directly from @sveltejs/kit
import type { KitchenTool } from '$lib/types'; // Import the KitchenTool type

// --- GET Handler (Existing) ---
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

// --- POST Handler (New) ---
export const POST: RequestHandler = async ({ request, platform, locals }) => {
    const db = platform?.env?.DB;

    // --- Authentication (Optional - decide if needed) ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    // For now, let's allow authenticated users to add tools
    if (!user?.authenticated) {
         console.warn("[API /api/kitchen_tools POST] Unauthenticated user attempted tool creation.");
         throw error(401, 'Authentication required to add kitchen tools.');
    }
    // --- End Authentication ---

    if (!db) {
        console.error("[API /api/kitchen_tools POST] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        const body = await request.json();
        const name = body.name?.toString().trim();

        console.log("[API /api/kitchen_tools POST] Received tool creation request:", { name });

        // --- Validation ---
        if (!name || name === '') {
            throw error(400, 'Kitchen tool name is required.');
        }
        // Could add max length validation etc.
        // --- End Validation ---

        // --- Database Insertion ---
        try {
            const stmt = db.prepare('INSERT INTO kitchen_tools (name) VALUES (?) RETURNING id, name');
            const newTool = await stmt.bind(name).first<KitchenTool>();

            if (!newTool) {
                 console.error("[API /api/kitchen_tools POST] Failed to insert tool or retrieve result.");
                 throw error(500, "Failed to create kitchen tool record.");
            }

            console.log(`[API /api/kitchen_tools POST] Successfully created tool ID: ${newTool.id}`);
            return json({ kitchen_tool: newTool }, { status: 201 }); // 201 Created

        } catch (dbError: any) {
             // Handle potential unique constraint violation (name is UNIQUE)
             if (dbError.message?.includes('UNIQUE constraint failed')) {
                 console.warn(`[API /api/kitchen_tools POST] Attempted to create duplicate tool name: ${name}`);
                 throw error(409, `Un ustensile nommé '${name}' existe déjà.`); // 409 Conflict
             }
             // Re-throw other DB errors
             throw dbError;
        }
        // --- End Database Insertion ---

    } catch (e: any) {
        // Handle specific errors (like validation or DB errors) or re-throw others
        if (e.status >= 400 && e.status < 500) {
            throw e; // Re-throw client-side or conflict errors
        }
        console.error('[API /api/kitchen_tools POST] Error creating tool:', e);
        throw error(500, `Failed to create kitchen tool: ${e.message || 'Unknown error'}`);
    }
};