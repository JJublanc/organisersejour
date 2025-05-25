import postgres, { type Sql as PostgresSqlType } from 'postgres';

// Function to get the correct Neon database URL based on environment
export function getNeonDbUrl(env: any): string {
    console.log('[DB] getNeonDbUrl called with env:', env ? 'defined' : 'undefined');
    
    if (env) {
        console.log('[DB] Environment:', env.ENVIRONMENT);
        console.log('[DB] Available environment variables:', Object.keys(env));
        
        // Essayer d'accéder aux secrets de différentes manières
        const tryAccessSecret = (name: string) => {
            // Essayer d'accéder directement
            const direct = env[name];
            // Essayer d'accéder via la propriété 'secret'
            const viaSecret = env.secret && env.secret[name];
            // Essayer d'accéder via la propriété 'vars'
            const viaVars = env.vars && env.vars[name];
            
            console.log(`[DB] Trying to access ${name}:`);
            console.log(`  - Direct: ${direct ? 'defined' : 'undefined'}`);
            console.log(`  - Via secret: ${viaSecret ? 'defined' : 'undefined'}`);
            console.log(`  - Via vars: ${viaVars ? 'defined' : 'undefined'}`);
            
            return direct || viaSecret || viaVars;
        };
        
        if (env.ENVIRONMENT === 'preprod') {
            console.log('[DB] Environment is preprod');
            const url = tryAccessSecret('NEON_PREPROD_URL');
            if (url) {
                console.log('[DB] Found NEON_PREPROD_URL');
                return url;
            }
        } else if (env.ENVIRONMENT === 'prod') {
            console.log('[DB] Environment is prod');
            const url = tryAccessSecret('NEON_PROD_URL');
            if (url) {
                console.log('[DB] Found NEON_PROD_URL');
                return url;
            }
        } else {
            console.log('[DB] Environment is dev or undefined');
            const url = tryAccessSecret('NEON_DEV_URL');
            if (url) {
                console.log('[DB] Found NEON_DEV_URL');
                return url;
            }
        }
        
        // Si nous n'avons pas trouvé d'URL spécifique à l'environnement, essayer de trouver n'importe quelle URL
        console.log('[DB] Trying to find any available database URL');
        const anyUrl = tryAccessSecret('NEON_PREPROD_URL') || tryAccessSecret('NEON_PROD_URL') || tryAccessSecret('NEON_DEV_URL');
        if (anyUrl) {
            console.log('[DB] Found a database URL');
            return anyUrl;
        }
        
        console.log('[DB] No database URL found in env');
    } else {
        console.log('[DB] env is undefined, cannot determine database URL');
    }
    
    return ''; // Retourner une chaîne vide au lieu de undefined pour satisfaire le type string
}

// Create a new postgres.Sql instance for each request
export function getDbClient(dbUrl: string): PostgresSqlType {
    console.log('[DB] getDbClient called with dbUrl:', dbUrl ? 'non-empty' : 'empty');
    
    if (!dbUrl) {
        console.error('[DB] Database URL is empty or undefined');
        throw new Error('Database connection information not found.');
    }
    
    try {
        // Always create a new instance for each request to comply with Cloudflare Workers isolation
        const sql = postgres(dbUrl, {
            ssl: 'require', // Neon typically requires SSL. Adjust if your setup differs.
            // Considerations for serverless environments:
            max: 1, // Limit max connections for serverless
            idle_timeout: 5, // Seconds before closing idle connections
            connect_timeout: 10, // Seconds to wait for connection
            onnotice: (notice) => console.log('[DB NOTICE]', notice), // Log PostgreSQL notices
            debug: (connection, query, params) => { // Log queries
               console.log('[DB DEBUG]', query, params);
            }
        });
        
        console.log('[DB] Database client created successfully');
        return sql;
    } catch (error) {
        console.error('[DB] Error creating database client:', error);
        throw error;
    }
}

export async function getShoppingList(tripId: string): Promise<{ name: string; quantity: number }[]> {
    const dbUrl = getNeonDbUrl(process.env);
    const sql = getDbClient(dbUrl);

    try {
        const result = await sql`
            SELECT i.name, SUM(mc.quantity) as quantity
            FROM meal_components mc
            JOIN ingredients i ON mc.ingredient_id = i.id
            WHERE mc.trip_id = ${tripId}
            GROUP BY i.name
        `;
        return result.map((row: any) => ({
            name: row.name,
            quantity: row.quantity
        }));
    } catch (error) {
        console.error('[DB] Error fetching shopping list:', error);
        throw error;
    }
}