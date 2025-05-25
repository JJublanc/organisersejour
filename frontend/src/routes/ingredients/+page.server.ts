import { error, type ServerLoad } from '@sveltejs/kit';
import type { Ingredient } from '$lib/types';
import { getNeonDbUrl, getDbClient } from '$lib/server/db';
import type { User } from '$lib/auth';

export const load: ServerLoad = async ({ platform, locals, parent }) => {
    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[Page /ingredients] Neon Database URL not found.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);

    const parentData = await parent();
    let user: User | null = parentData.user as User | null;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';

    if (authEnabled && (!user || !user.authenticated)) {
        throw error(401, 'Authentication required');
    }
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user) {
        throw error(401, 'User context not available');
    }

    try {
        console.log(`[Page /ingredients] Fetching ingredients for user: ${user.id} and system ingredients`);

        const ingredients = await sql<Ingredient[]>`
            SELECT
                id, name, unit, type, season, user_id
            FROM ingredients
            WHERE user_id = ${user.id} OR user_id = 'system'
            ORDER BY type ASC, name ASC
        `;

        if (ingredients && ingredients.length > 0) {
            const typeDistribution = ingredients.reduce((acc, ing) => {
                acc[ing.type] = (acc[ing.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            console.log(`[Page /ingredients] Type distribution: ${JSON.stringify(typeDistribution)}`);
        }

        console.log(`[Page /ingredients] Successfully fetched ${ingredients?.length ?? 0} ingredients.`);
        return { ingredients: ingredients || [] };

    } catch (e: any) {
        console.error('[Page /ingredients] Error fetching ingredients:', e);
        if (e.code === '42P01') { // undefined_table for PostgreSQL
             console.error(`[Page /ingredients] Table not found. This might indicate migrations haven't run on Neon for the current environment.`);
             throw error(500, `Database table not found. Please ensure migrations are up to date. Error: ${e.message}`);
        }
        throw error(500, `Failed to fetch ingredients: ${e.message || 'Unknown error'}`);
    }
};