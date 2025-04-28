import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Ingredient } from '$lib/types';

export const load: PageServerLoad = async ({ platform, locals }) => {
    const db = platform?.env?.DB;
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';

    // If auth is enabled, ensure user is authenticated
    if (authEnabled && !user?.authenticated) {
        throw error(401, 'Authentication required');
    }
    
    // Pour le développement, utiliser un utilisateur par défaut si l'authentification est désactivée
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user2', name: 'Development User', authenticated: true };
    }

    if (!db) {
        console.error("[Page /ingredients] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        console.log(`[Page /ingredients] Fetching ingredients for user: ${user.id}`);

        // Fetch user's ingredients
        const stmt = db.prepare('SELECT id, name, unit, type, user_id FROM ingredients WHERE user_id = ? ORDER BY type ASC, name ASC');
        const { results } = await stmt.bind(user.id).all<Ingredient>();

        // Log ingredient types distribution for validation
        if (results && results.length > 0) {
            const typeDistribution = results.reduce((acc, ing) => {
                acc[ing.type] = (acc[ing.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            console.log(`[Page /ingredients] Type distribution: ${JSON.stringify(typeDistribution)}`);
        }

        console.log(`[Page /ingredients] Successfully fetched ${results?.length ?? 0} ingredients.`);
        return { ingredients: results || [] };

    } catch (e: any) {
        console.error('[Page /ingredients] Error fetching ingredients:', e);
        throw error(500, `Failed to fetch ingredients: ${e.message || 'Unknown error'}`);
    }
};