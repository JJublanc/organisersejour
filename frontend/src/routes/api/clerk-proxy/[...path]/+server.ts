import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ platform, url, request, params }) => {
	// Récupérer l'origine pour CORS avec support des domaines autorisés
	const requestOrigin = request.headers.get('origin');
	const allowedOrigins = [
		'https://organisersejour.com',
		'https://www.organisersejour.com',
		'https://organisersejour.pages.dev',
		'https://ce2d8dc8.organisersejour.pages.dev',
		'http://localhost:8788',
		'http://localhost:5173'
	];
	
	const origin = allowedOrigins.includes(requestOrigin || '')
		? (requestOrigin || 'https://organisersejour.com')
		: 'https://organisersejour.com';

	// Récupérer le chemin depuis les paramètres de route
	const path = `/${params.path || ''}`;
	
	// URL de base de l'API Clerk
	const clerkApiUrl = 'https://frontend-api.clerk.dev';
	
	// Construire l'URL complète avec les query parameters
	const targetUrl = `${clerkApiUrl}${path}${url.search}`;
	
	console.log('[Clerk Proxy] GET:', targetUrl);
	
	try {
		// Copier les headers de la requête originale
		const headers = new Headers();
		for (const [key, value] of request.headers.entries()) {
			// Exclure les headers qui peuvent causer des problèmes
			if (!['host', 'origin', 'referer'].includes(key.toLowerCase())) {
				headers.set(key, value);
			}
		}
		
		// Ajouter les headers requis par Clerk
		headers.set('Clerk-Proxy-Url', 'https://organisersejour.pages.dev/api/clerk-proxy');
		headers.set('Clerk-Secret-Key', platform?.env?.CLERK_SECRET_KEY || '');
		headers.set('X-Forwarded-For', request.headers.get('cf-connecting-ip') || '127.0.0.1');
		
		// Faire la requête vers l'API Clerk
		const response = await fetch(targetUrl, {
			method: 'GET',
			headers
		});
		
		console.log('[Clerk Proxy] Response status:', response.status);
		
		// Copier UNIQUEMENT les headers de réponse non-CORS
		const responseHeaders = new Headers();
		const responseHeadersToCopy = [
			'content-type',
			'cache-control',
			'expires',
			'last-modified',
			'etag',
			'content-length',
			'content-encoding'
		];

		responseHeadersToCopy.forEach(headerName => {
			const value = response.headers.get(headerName);
			if (value) {
				responseHeaders.set(headerName, value);
			}
		});
		
		// Ajouter NOS headers CORS (ne pas copier ceux de Clerk)
		responseHeaders.set('Access-Control-Allow-Origin', origin);
		responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		responseHeaders.set('Access-Control-Allow-Credentials', 'true');
		
		// Retourner la réponse
		return new Response(await response.text(), {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders
		});
		
	} catch (error) {
		console.error('[Clerk Proxy] Erreur GET:', error);
		return new Response(JSON.stringify({ error: 'Erreur proxy' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': origin,
				'Access-Control-Allow-Credentials': 'true'
			}
		});
	}
};

export const POST: RequestHandler = async ({ platform, url, request, params }) => {
	// Récupérer l'origine pour CORS avec support des domaines autorisés
	const requestOrigin = request.headers.get('origin');
	const allowedOrigins = [
		'https://organisersejour.com',
		'https://www.organisersejour.com',
		'https://organisersejour.pages.dev',
		'https://ce2d8dc8.organisersejour.pages.dev',
		'http://localhost:8788',
		'http://localhost:5173'
	];
	
	const origin = allowedOrigins.includes(requestOrigin || '')
		? (requestOrigin || 'https://organisersejour.com')
		: 'https://organisersejour.com';

	const path = `/${params.path || ''}`;
	const clerkApiUrl = 'https://frontend-api.clerk.dev';
	const targetUrl = `${clerkApiUrl}${path}${url.search}`;
	
	console.log('[Clerk Proxy] POST:', targetUrl);
	
	try {
		const headers = new Headers();
		for (const [key, value] of request.headers.entries()) {
			if (!['host', 'origin', 'referer'].includes(key.toLowerCase())) {
				headers.set(key, value);
			}
		}
		
		// Ajouter les headers requis par Clerk
		headers.set('Clerk-Proxy-Url', 'https://organisersejour.pages.dev/api/clerk-proxy');
		headers.set('Clerk-Secret-Key', platform?.env?.CLERK_SECRET_KEY || '');
		headers.set('X-Forwarded-For', request.headers.get('cf-connecting-ip') || '127.0.0.1');
		
		const response = await fetch(targetUrl, {
			method: 'POST',
			headers,
			body: await request.text()
		});
		
		console.log('[Clerk Proxy] POST Response status:', response.status);
		
		// Copier UNIQUEMENT les headers de réponse non-CORS
		const responseHeaders = new Headers();
		const responseHeadersToCopy = [
			'content-type',
			'cache-control',
			'expires',
			'last-modified',
			'etag',
			'content-length',
			'content-encoding'
		];

		responseHeadersToCopy.forEach(headerName => {
			const value = response.headers.get(headerName);
			if (value) {
				responseHeaders.set(headerName, value);
			}
		});
		
		// Ajouter NOS headers CORS (ne pas copier ceux de Clerk)
		responseHeaders.set('Access-Control-Allow-Origin', origin);
		responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		responseHeaders.set('Access-Control-Allow-Credentials', 'true');
		
		return new Response(await response.text(), {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders
		});
		
	} catch (error) {
		console.error('[Clerk Proxy] Erreur POST:', error);
		return new Response(JSON.stringify({ error: 'Erreur proxy' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': origin,
				'Access-Control-Allow-Credentials': 'true'
			}
		});
	}
};

export const OPTIONS: RequestHandler = async ({ request }) => {
	// Récupérer l'origine pour CORS avec support des domaines autorisés
	const requestOrigin = request.headers.get('origin');
	const allowedOrigins = [
		'https://organisersejour.com',
		'https://www.organisersejour.com',
		'https://organisersejour.pages.dev',
		'https://ce2d8dc8.organisersejour.pages.dev',
		'http://localhost:8788',
		'http://localhost:5173'
	];
	
	const origin = allowedOrigins.includes(requestOrigin || '')
		? (requestOrigin || 'https://organisersejour.com')
		: 'https://organisersejour.com';

	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': origin,
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Max-Age': '86400'
		}
	});
};