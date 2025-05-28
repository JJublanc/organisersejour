import { error, type ServerLoad } from '@sveltejs/kit';
import type { Ingredient } from '$lib/types';
import { getNeonDbUrl, getDbClient } from '$lib/server/db';
import type { User } from '$lib/clerk-auth';

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

    // Pour Clerk, on utilise un utilisateur par défaut côté serveur
    // L'authentification réelle se fait côté client
    if (!user) {
        user = { email: 'clerk-user@example.com', id: 'clerk-user', name: 'Clerk User', authenticated: true };
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
        
        // Retourner aussi les données d'authentification pour les pages protégées
        return {
            ingredients: ingredients || [],
            authEnabled: platform?.env?.AUTH_ENABLED === 'true',
            clerkPublishableKey: platform?.env?.CLERK_PUBLISHABLE_KEY || null,
            user
        };

    } catch (e: any) {
        console.error('[Page /ingredients] Error fetching ingredients:', e);
        if (e.code === '42P01') { // undefined_table for PostgreSQL
             console.error(`[Page /ingredients] Table not found. This might indicate migrations haven't run on Neon for the current environment.`);
             throw error(500, `Database table not found. Please ensure migrations are up to date. Error: ${e.message}`);
        }
        throw error(500, `Failed to fetch ingredients: ${e.message || 'Unknown error'}`);
    }
};