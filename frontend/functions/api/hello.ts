export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
	const isPreprod = env.ENVIRONMENT === 'preprod';
	const db = isPreprod ? env.DB_PREPROD : env.DB_PROD;

	const result = await db.prepare('SELECT text FROM messages WHERE id = 1').first();

	return Response.json({
		message: result?.text || 'No message found',
	});
};

interface Env {
	DB_PROD: D1Database;
	DB_PREPROD: D1Database;
	ENVIRONMENT: string;
}
