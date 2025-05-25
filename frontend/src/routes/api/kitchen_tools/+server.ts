import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { KitchenTool } from '$lib/types';
import { getNeonDbUrl, getDbClient } from '$lib/server/db';

// --- GET Handler ---
export const GET: RequestHandler = async ({ platform }: { platform: App.Platform | undefined }) => {
    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[API /api/kitchen_tools GET] Neon Database URL not found.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);

    try {
        console.log("[API /api/kitchen_tools GET] Fetching all kitchen tools...");
        const kitchenTools = await sql<KitchenTool[]>`
            SELECT id, name FROM kitchen_tools ORDER BY name ASC
        `;
        console.log(`[API /api/kitchen_tools GET] Successfully fetched ${kitchenTools?.length ?? 0} kitchen tools.`);
        return json({ kitchen_tools: kitchenTools || [] });
    } catch (e: any) {
        console.error('[API /api/kitchen_tools GET] Error fetching kitchen tools:', e);
        throw error(500, `Failed to fetch kitchen tools: ${e.message || 'Unknown error'}`);
    }
};

// --- POST Handler ---
export const POST: RequestHandler = async ({ request, platform, locals }) => {
    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[API /api/kitchen_tools POST] Neon Database URL not found.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);

    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated) {
         throw error(401, 'Authentication required to add kitchen tools.');
    }

    try {
        const body = await request.json();
        const name = body.name?.toString().trim();
        console.log("[API /api/kitchen_tools POST] Received tool creation request:", { name });

        if (!name || name === '') {
            throw error(400, 'Kitchen tool name is required.');
        }

        const results = await sql<KitchenTool[]>`
            INSERT INTO kitchen_tools (name) VALUES (${name}) RETURNING id, name
        `;
        const newTool = results[0];

        if (!newTool) {
             throw error(500, "Failed to create kitchen tool record.");
        }
        console.log(`[API /api/kitchen_tools POST] Successfully created tool ID: ${newTool.id}`);
        return json({ kitchen_tool: newTool }, { status: 201 });
    } catch (e: any) {
         if (e.code === '23505') { // PostgreSQL unique violation
            const bodyForError = await request.clone().json();
            console.warn(`[API /api/kitchen_tools POST] Attempted to create duplicate tool name: ${bodyForError.name}`);
            throw error(409, `Un ustensile nommé '${bodyForError.name}' existe déjà.`);
         }
         if (e.status >= 400 && e.status < 500) throw e;
         console.error('[API /api/kitchen_tools POST] Error creating tool:', e);
         throw error(500, `Failed to create kitchen tool: ${e.message || 'Unknown error'}`);
    }
};

// --- DELETE Handler ---
export const DELETE: RequestHandler = async ({ request, platform, locals, url }) => {
    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[API /api/kitchen_tools DELETE] Neon Database URL not found.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);
    
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated) {
        throw error(401, 'Authentication required to delete kitchen tools.');
    }
    
    try {
        const toolIdParam = url.searchParams.get('id');
        if (!toolIdParam || isNaN(parseInt(toolIdParam))) {
            throw error(400, "Invalid kitchen tool ID parameter.");
        }
        const id = parseInt(toolIdParam);
        console.log(`[API /api/kitchen_tools DELETE] Attempting to delete kitchen tool ID: ${id}`);
        
        const tools = await sql<{ id: number, name: string }[]>`
            SELECT id, name FROM kitchen_tools WHERE id = ${id}
        `;
        const tool = tools[0];
        
        if (!tool) {
            throw error(404, "Kitchen tool not found.");
        }
        
        const systemCheckResults = await sql<{ count: string }[]>`
            SELECT COUNT(*) as count
            FROM recipe_kitchen_tools rkt
            JOIN recipes r ON rkt.recipe_id = r.id
            WHERE rkt.tool_id = ${id} AND r.user_id = 'system'
        `;
        if (systemCheckResults[0] && parseInt(systemCheckResults[0].count) > 0) {
            throw error(403, `Cet ustensile est fourni par le système et ne peut pas être supprimé.`);
        }
        
        const usageResults = await sql<{ count: string }[]>`
            SELECT COUNT(*) as count FROM recipe_kitchen_tools WHERE tool_id = ${id}
        `;
        if (usageResults[0] && parseInt(usageResults[0].count) > 0) {
            throw error(409, `Cet ustensile est utilisé dans ${usageResults[0].count} recette(s) et ne peut pas être supprimé.`);
        }
        
        const deleteResult = await sql`DELETE FROM kitchen_tools WHERE id = ${id}`;
        
        if (deleteResult.count === 0) {
            throw error(500, "Failed to delete kitchen tool (no rows affected).");
        }
        
        console.log(`[API /api/kitchen_tools DELETE] Successfully deleted kitchen tool ID: ${id}`);
        return json({ success: true, message: "Ustensile supprimé avec succès." });
    } catch (e: any) {
        if (e.status >= 400 && e.status < 500) throw e;
        console.error('[API /api/kitchen_tools DELETE] Error deleting kitchen tool:', e);
        throw error(500, `Failed to delete kitchen tool: ${e.message || 'Unknown error'}`);
    }
};