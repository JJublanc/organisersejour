import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, url, request, platform }) => {
	return handleClerkProxy(params, url, request, 'GET', platform);
};

export const POST: RequestHandler = async ({ params, url, request, platform }) => {
	return handleClerkProxy(params, url, request, 'POST', platform);
};

export const PUT: RequestHandler = async ({ params, url, request, platform }) => {
	return handleClerkProxy(params, url, request, 'PUT', platform);
};

export const DELETE: RequestHandler = async ({ params, url, request, platform }) => {
	return handleClerkProxy(params, url, request, 'DELETE', platform);
};

export const PATCH: RequestHandler = async ({ params, url, request, platform }) => {
	return handleClerkProxy(params, url, request, 'PATCH', platform);
};

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Forwarded-For'
		}
	});
};

async function handleClerkProxy(
	params: any,
	url: URL,
	request: Request,
	method: string,
	platform: any
): Promise<Response> {
	try {
		// Construire le path vers l'API Clerk
		const clerkPath = params.path || '';
		const clerkUrl = `https://frontend-api.clerk.dev/${clerkPath}${url.search}`;
		
		// Copier les headers de la requête originale
		const headers = new Headers();
		for (const [key, value] of request.headers.entries()) {
			// Exclure certains headers qui peuvent causer des problèmes
			if (!['host', 'origin', 'referer'].includes(key.toLowerCase())) {
				headers.set(key, value);
			}
		}
		
		// Ajouter les headers requis par Clerk
		headers.set('Clerk-Proxy-Url', 'https://organisersejour.pages.dev/api/clerk');
		headers.set('Clerk-Secret-Key', platform?.env?.CLERK_SECRET_KEY || '');
		
		// Ajouter X-Forwarded-For avec l'IP du client
		const clientIP = request.headers.get('cf-connecting-ip') || 
						request.headers.get('x-forwarded-for') || 
						request.headers.get('x-real-ip') || 
						'127.0.0.1';
		headers.set('X-Forwarded-For', clientIP);
		
		// Préparer le body pour les requêtes POST/PUT/PATCH
		let body: string | null = null;
		if (['POST', 'PUT', 'PATCH'].includes(method)) {
			body = await request.text();
		}
		
		// Faire la requête vers l'API Clerk
		const response = await fetch(clerkUrl, {
			method,
			headers,
			body
		});
		
		// Copier les headers de la réponse
		const responseHeaders = new Headers();
		for (const [key, value] of response.headers.entries()) {
			// Exclure certains headers qui peuvent causer des problèmes
			if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
				responseHeaders.set(key, value);
			}
		}
		
		// Ajouter les headers CORS si nécessaire
		if (!responseHeaders.has('access-control-allow-origin')) {
			responseHeaders.set('Access-Control-Allow-Origin', '*');
		}
		
		// Retourner la réponse
		const responseBody = await response.arrayBuffer();
		return new Response(responseBody, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders
		});
		
	} catch (error) {
		console.error('Erreur proxy Clerk:', error);
		return new Response(JSON.stringify({ 
			error: 'Erreur proxy Clerk',
			details: error instanceof Error ? error.message : 'Erreur inconnue'
		}), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
}