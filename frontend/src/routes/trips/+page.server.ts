import { redirect, fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { User } from '$lib/clerk-auth';
import type { Trip } from '$lib/types';
import { getNeonDbUrl, getDbClient } from '$lib/server/db';
import type { TransactionSql } from 'postgres';

export type TripsPageData = {
    trips: Trip[];
    authEnabled: boolean;
    clerkPublishableKey: string | null;
    user: User | null;
};

export const load: PageServerLoad = async ({ locals, platform, parent }): Promise<TripsPageData> => {
    console.log("[Trips Load] Starting load function...");
    console.log("[Trips Load] platform:", platform ? "defined" : "undefined");
    console.log("[Trips Load] platform.env:", platform?.env ? "defined" : "undefined");
    
    if (platform?.env) {
        console.log("[Trips Load] Environment:", platform.env.ENVIRONMENT);
        console.log("[Trips Load] Available environment variables:", Object.keys(platform.env));
        
        // Vérifier si les variables de base de données sont définies
        // Utiliser une assertion de type pour éviter les erreurs TypeScript
        console.log("[Trips Load] NEON_PREPROD_URL:", (platform.env as any).NEON_PREPROD_URL ? "defined" : "undefined");
        console.log("[Trips Load] NEON_PROD_URL:", (platform.env as any).NEON_PROD_URL ? "defined" : "undefined");
        console.log("[Trips Load] NEON_DEV_URL:", (platform.env as any).NEON_DEV_URL ? "defined" : "undefined");
    }
    
    const dbUrl = getNeonDbUrl(platform?.env);
    console.log("[Trips Load] dbUrl after getNeonDbUrl:", dbUrl ? "non-empty" : "empty");
    
    if (!dbUrl) {
        console.error("[Trips Load] Neon Database URL not found.");
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
    
    const userId = user.id;

    try {
        console.log(`[Trips Load] Fetching trips for organiser_id: ${userId}`);
        const trips = await sql<Trip[]>`
            SELECT * FROM trips WHERE organiser_id = ${userId} ORDER BY start_date DESC
        `;
        console.log("[Trips Load] Fetched trips results:", trips);
        
        // Retourner aussi les données d'authentification pour les pages protégées
        return {
            trips: trips || [],
            authEnabled: platform?.env?.AUTH_ENABLED === 'true',
            clerkPublishableKey: platform?.env?.CLERK_PUBLISHABLE_KEY || null,
            user
        };
    } catch (e: any) {
        console.error('[Trips Load] Error fetching trips:', e);
        if (e.code === '42P01') {
             console.error(`[Trips Load] Table not found. This might indicate migrations haven't run on Neon for the current environment.`);
             throw error(500, `Database table not found. Please ensure migrations are up to date. Error: ${e.message}`);
        }
        throw error(500, `Failed to fetch trips: ${e.message || 'Unknown error'}`);
    }
};

export const actions: Actions = {
    createTrip: async ({ request, locals, platform }) => {
        console.log("--- createTrip action started ---");
        const dbUrl = getNeonDbUrl(platform?.env);
        if (!dbUrl) {
            console.error("[Action createTrip] Neon Database URL not found.");
            return fail(500, { error: "Database connection information not found." });
        }
        const sql = getDbClient(dbUrl);

        let user = locals.user;
        const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
        if (!authEnabled && !user) {
             user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User (Action)', authenticated: true };
        }

        if (!user?.authenticated || !user.id) {
            console.error("[Action createTrip] User not authenticated or missing ID");
            return fail(401, { error: 'User not authenticated' });
        }
        const organiserId = user.id;

        const formData = await request.formData();
        const name = formData.get('name')?.toString();
        const startDate = formData.get('start_date')?.toString();
        const endDate = formData.get('end_date')?.toString();
        const location = formData.get('location')?.toString() || null;
        const numPeopleStr = formData.get('num_people')?.toString();

        if (!name || !startDate || !endDate || !numPeopleStr) {
            return fail(400, { error: 'Missing required fields', name, startDate, endDate, numPeopleStr });
        }
        const numPeople = parseInt(numPeopleStr);
        if (isNaN(numPeople) || numPeople < 1) {
             return fail(400, { error: 'Invalid number of people', name, startDate, endDate, numPeopleStr });
        }
        if (new Date(endDate) < new Date(startDate)) {
             return fail(400, { error: 'End date cannot be before start date', name, startDate, endDate, numPeopleStr });
        }

        try {
            const newTripId = await sql.begin(async (sqltrx: TransactionSql) => {
                const insertedTrip = await sqltrx<{ id: number }[]>`
                    INSERT INTO trips (name, start_date, end_date, location, organiser_id, num_people)
                    VALUES (${name}, ${startDate}, ${endDate}, ${location}, ${organiserId}, ${numPeople})
                    RETURNING id
                `;
                const tripId = insertedTrip[0]?.id;
                if (!tripId) {
                    throw new Error("Failed to insert trip or get last_row_id.");
                }
                console.log(`[Action createTrip] Trip created with ID: ${tripId}. Now adding days and meals.`);

                const start = new Date(startDate);
                const end = new Date(endDate);
                let currentDate = new Date(start);

                while (currentDate <= end) {
                    const dateString = currentDate.toISOString().split('T')[0];
                    console.log(`[Action createTrip] Processing date: ${dateString} for trip ${tripId}`);

                    const insertedDay = await sqltrx<{ id: number }[]>`
                        INSERT INTO trip_days (trip_id, date) VALUES (${tripId}, ${dateString}) RETURNING id
                    `;
                    const newTripDayId = insertedDay[0]?.id;

                    if (!newTripDayId) {
                        console.error(`[Action createTrip] Failed to insert trip_day for date ${dateString}, tripId ${tripId}. Skipping meals for this day.`);
                    } else {
                        console.log(`[Action createTrip] Inserted trip_day ID: ${newTripDayId} for date ${dateString}`);
                        const mealTypes = ['breakfast', 'lunch', 'dinner'];
                        for (const type of mealTypes) {
                            await sqltrx`
                                INSERT INTO meals (trip_day_id, type) VALUES (${newTripDayId}, ${type})
                            `;
                        }
                        console.log(`[Action createTrip] Successfully added default meals for day ${dateString} (Day ID: ${newTripDayId}).`);
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                console.log(`[Action createTrip] Finished processing days/meals for trip ${tripId}.`);
                return tripId; // Return the new trip ID from the transaction
            });

            // If execution reaches here, the transaction was successful
            return { success: true, message: 'Séjour créé avec succès!', tripId: newTripId };

        } catch (dbError: any) {
            console.error('[Action createTrip] Error creating trip:', dbError);
            if (dbError.code === '42P01') { // undefined_table for PostgreSQL
                return fail(500, { error: `Database table not found. Please ensure migrations are up to date. Error: ${dbError.message}` });
            }
            return fail(500, { error: `Failed to create trip: ${dbError.message || 'Unknown error'}` });
        }
    }
};