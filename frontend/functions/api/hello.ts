export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
	const result = await env.DB.prepare('SELECT text FROM messages WHERE id = 1').first();

	return Response.json({
		message: result?.text || 'No message found',
	});
};

interface Env {
	DB: D1Database;
}
