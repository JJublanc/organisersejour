import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ platform, url, request }) => {
	// Extraire le path de la requête
	const path = url.searchParams.get('path') || '';
	
	// URL de base de l'API Clerk
	const clerkApiUrl = 'https://frontend-api.clerk.dev';
	
	// Construire l'URL complète
	const targetUrl = `${clerkApiUrl}${path}${url.search}`;
	
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
		
		// Copier les headers de la réponse
		const responseHeaders = new Headers();
		for (const [key, value] of response.headers.entries()) {
			// Ajouter les headers CORS
			if (!['content-encoding', 'content-length'].includes(key.toLowerCase())) {
				responseHeaders.set(key, value);
			}
		}
		
		// Ajouter les headers CORS
		responseHeaders.set('Access-Control-Allow-Origin', '*');
		responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		
		// Retourner la réponse
		return new Response(await response.text(), {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders
		});
		
	} catch (error) {
		console.error('Erreur proxy Clerk:', error);
		return new Response(JSON.stringify({ error: 'Erreur proxy' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
};

export const POST: RequestHandler = async ({ platform, url, request }) => {
	const path = url.searchParams.get('path') || '';
	const clerkApiUrl = 'https://frontend-api.clerk.dev';
	const targetUrl = `${clerkApiUrl}${path}${url.search}`;
	
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
		
		const responseHeaders = new Headers();
		for (const [key, value] of response.headers.entries()) {
			if (!['content-encoding', 'content-length'].includes(key.toLowerCase())) {
				responseHeaders.set(key, value);
			}
		}
		
		responseHeaders.set('Access-Control-Allow-Origin', '*');
		responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		
		return new Response(await response.text(), {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders
		});
		
	} catch (error) {
		console.error('Erreur proxy Clerk POST:', error);
		return new Response(JSON.stringify({ error: 'Erreur proxy' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	}
};

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
};