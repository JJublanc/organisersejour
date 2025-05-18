import postgres, { type Sql as PostgresSqlType } from 'postgres';

// Function to get the correct Neon database URL based on environment
export function getNeonDbUrl(env: any): string {
    if (env?.ENVIRONMENT === 'preprod') {
        return env?.NEON_PREPROD_URL;
    } else if (env?.ENVIRONMENT === 'prod') {
        return env?.NEON_PROD_URL;
    } else {
        // Default to dev or a local URL if needed
        return env?.NEON_DEV_URL;
    }
}

// Create a new postgres.Sql instance for each request
export function getDbClient(dbUrl: string): PostgresSqlType {
    // Always create a new instance for each request to comply with Cloudflare Workers isolation
    const sql = postgres(dbUrl, {
        ssl: 'require', // Neon typically requires SSL. Adjust if your setup differs.
        // Considerations for serverless environments:
        max: 1, // Limit max connections for serverless
        idle_timeout: 5, // Seconds before closing idle connections
        connect_timeout: 10, // Seconds to wait for connection
        // onnotice: console.log, // Optional: log PostgreSQL notices
        // debug: (connection, query, params) => { // Optional: log queries
        //    console.log('[DB DEBUG]', query, params);
        // }
    });
    
    return sql;
}