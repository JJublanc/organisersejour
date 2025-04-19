export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
	// Use DB_PREPROD for local (undefined ENVIRONMENT) and preview ('preprod')
	// Use DB for production ('prod')
	const isProd = env.ENVIRONMENT === 'prod';
	const db = isProd ? env.DB : env.DB_PREPROD;

	const result = await db.prepare('SELECT text FROM messages WHERE id = 1').first();

	return Response.json({
		message: result?.text || 'No message found',
	});
};

export interface Env { // Add export keyword
	DB: D1Database; // Binding for production DB
	DB_PREPROD: D1Database; // Binding for preproduction DB
	ENVIRONMENT?: string; // Environment variable (optional locally)
	AUTH_ENABLED?: string; // Added for Cloudflare Access check
}
