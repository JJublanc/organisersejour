import { json, error, type RequestHandler } from '@sveltejs/kit';
import { getNeonDbUrl, getDbClient } from '$lib/server/db';
import type { TransactionSql } from 'postgres';

// --- DELETE Handler ---
export const DELETE: RequestHandler = async ({ request, platform, locals, url }) => {
    const dbUrl = getNeonDbUrl(platform?.env);
    if (!dbUrl) {
        console.error("[API /api/trips DELETE] Neon Database URL not found for environment.");
        throw error(500, "Database connection information not found.");
    }
    const sql = getDbClient(dbUrl);
    
    // For Clerk authentication, we'll use a default user ID
    // TODO: Implement proper Clerk session verification
    const clerkPublishableKey = platform?.env?.CLERK_PUBLISHABLE_KEY;
    if (!clerkPublishableKey) {
        throw error(500, 'Authentication not configured');
    }
    
    // Use a default user ID for Clerk-authenticated requests
    const user = {
        id: 'clerk-user',
        email: 'clerk-user@example.com',
        name: 'Clerk User',
        authenticated: true
    };
    
    try {
        const tripIdParam = url.searchParams.get('id');
        if (!tripIdParam || isNaN(parseInt(tripIdParam))) {
            throw error(400, "Invalid trip ID parameter.");
        }
        const id = parseInt(tripIdParam);
        console.log(`[API /api/trips DELETE] Attempting to delete trip ID: ${id} for user: ${user.id}`);
        
        const checkResult = await sql<{ id: number }[]>`
            SELECT id FROM trips WHERE id = ${id} AND organiser_id = ${user.id}
        `;
        
        if (checkResult.length === 0) {
            throw error(404, "Trip not found or you don't have permission to delete it.");
        }
        
        await sql.begin(async (sqltrx: TransactionSql) => {
            const tripDays = await sqltrx<{ id: number }[]>`
                SELECT id FROM trip_days WHERE trip_id = ${id}
            `;
            
            if (tripDays && tripDays.length > 0) {
                const tripDayIds = tripDays.map((day: { id: number }) => day.id);
                
                for (const dayId of tripDayIds) {
                    const meals = await sqltrx<{ id: number }[]>`
                        SELECT id FROM meals WHERE trip_day_id = ${dayId}
                    `;
                    
                    if (meals && meals.length > 0) {
                        for (const meal of meals) {
                            await sqltrx`DELETE FROM meal_components WHERE meal_id = ${meal.id}`;
                        }
                        await sqltrx`DELETE FROM meals WHERE trip_day_id = ${dayId}`;
                    }
                }
                await sqltrx`DELETE FROM trip_days WHERE trip_id = ${id}`;
            }
            
            const deleteTripResult = await sqltrx`
                DELETE FROM trips WHERE id = ${id} AND organiser_id = ${user.id}
            `;

            if (deleteTripResult.count === 0) {
                // This might happen if the trip was deleted by another request between the check and this operation
                // or if for some reason the organiser_id check failed here but not above (unlikely with consistent data)
                throw new Error("Failed to delete trip itself, or it was already deleted/permission changed.");
            }
        });
        
        console.log(`[API /api/trips DELETE] Successfully deleted trip ID: ${id} and all related data`);
        return json({ success: true, message: "Séjour supprimé avec succès." });
        
    } catch (e: any) {
        if (e.status >= 400 && e.status < 500) {
            throw e;
        }
        console.error(`[API /api/trips DELETE] Error deleting trip ID ${url.searchParams.get('id')}:`, e);
        throw error(500, `Failed to delete trip: ${e.message || 'Unknown error'}`);
    }
};