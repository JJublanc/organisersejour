import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { D1PreparedStatement } from '@cloudflare/workers-types';

// --- DELETE Handler ---
export const DELETE: RequestHandler = async ({ request, platform, locals, url }) => {
    const db = platform?.env?.DB;
    
    // --- Authentication ---
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user2', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated) {
        console.warn("[API /api/trips DELETE] Unauthenticated user attempted to delete trip.");
        throw error(401, 'Authentication required to delete trips.');
    }
    // --- End Authentication ---
    
    if (!db) {
        console.error("[API /api/trips DELETE] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }
    
    try {
        // Get trip ID from query parameter
        const tripId = url.searchParams.get('id');
        if (!tripId || isNaN(parseInt(tripId))) {
            throw error(400, "Invalid trip ID parameter.");
        }
        
        const id = parseInt(tripId);
        console.log(`[API /api/trips DELETE] Attempting to delete trip ID: ${id} for user: ${user.id}`);
        
        // Check if trip belongs to user
        const checkStmt = db.prepare('SELECT id FROM trips WHERE id = ? AND organiser_id = ?');
        const trip = await checkStmt.bind(id, user.id).first<{ id: number }>();
        
        if (!trip) {
            throw error(404, "Trip not found or you don't have permission to delete it.");
        }
        
        // Start transaction to delete trip and related data
        const batchActions: D1PreparedStatement[] = [];
        
        // 1. First, get all trip_days for this trip
        const tripDaysStmt = db.prepare('SELECT id FROM trip_days WHERE trip_id = ?');
        const { results: tripDays } = await tripDaysStmt.bind(id).all<{ id: number }>();
        
        if (tripDays && tripDays.length > 0) {
            // Get all trip day IDs
            const tripDayIds = tripDays.map(day => day.id);
            
            // 2. For each trip day, get all meals
            for (const dayId of tripDayIds) {
                const mealsStmt = db.prepare('SELECT id FROM meals WHERE trip_day_id = ?');
                const { results: meals } = await mealsStmt.bind(dayId).all<{ id: number }>();
                
                if (meals && meals.length > 0) {
                    // 3. For each meal, delete meal components
                    for (const meal of meals) {
                        const deleteMealComponentsStmt = db.prepare('DELETE FROM meal_components WHERE meal_id = ?');
                        batchActions.push(deleteMealComponentsStmt.bind(meal.id));
                    }
                    
                    // 4. Delete all meals for this trip day
                    const deleteMealsStmt = db.prepare('DELETE FROM meals WHERE trip_day_id = ?');
                    batchActions.push(deleteMealsStmt.bind(dayId));
                }
            }
            
            // 5. Delete all trip days
            const deleteTripDaysStmt = db.prepare('DELETE FROM trip_days WHERE trip_id = ?');
            batchActions.push(deleteTripDaysStmt.bind(id));
        }
        
        // 6. Finally, delete the trip itself
        const deleteTripStmt = db.prepare('DELETE FROM trips WHERE id = ? AND organiser_id = ?');
        batchActions.push(deleteTripStmt.bind(id, user.id));
        
        // Execute batch
        console.log(`[API /api/trips DELETE] Executing batch of ${batchActions.length} delete operations`);
        await db.batch(batchActions);
        
        console.log(`[API /api/trips DELETE] Successfully deleted trip ID: ${id} and all related data`);
        return json({ success: true, message: "Séjour supprimé avec succès." });
        
    } catch (e: any) {
        if (e.status >= 400 && e.status < 500) {
            throw e; // Re-throw client-side errors
        }
        console.error('[API /api/trips DELETE] Error deleting trip:', e);
        throw error(500, `Failed to delete trip: ${e.message || 'Unknown error'}`);
    }
};