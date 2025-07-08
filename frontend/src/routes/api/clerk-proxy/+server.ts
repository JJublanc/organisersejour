import type { RequestHandler } from '@sveltejs/kit';

/**
 * Proxy handler simple pour les requêtes Clerk
 * Route sans paramètres dynamiques pour éviter les problèmes de déploiement
 */

export const GET: RequestHandler = async ({ url, request, platform }) => {
  return handleClerkProxy(url, request, platform, 'GET');
};

export const POST: RequestHandler = async ({ url, request, platform }) => {
  return handleClerkProxy(url, request, platform, 'POST');
};

export const PUT: RequestHandler = async ({ url, request, platform }) => {
  return handleClerkProxy(url, request, platform, 'PUT');
};

export const DELETE: RequestHandler = async ({ url, request, platform }) => {
  return handleClerkProxy(url, request, platform, 'DELETE');
};

export const PATCH: RequestHandler = async ({ url, request, platform }) => {
  return handleClerkProxy(url, request, platform, 'PATCH');
};

export const OPTIONS: RequestHandler = async ({ request }) => {
  const origin = request.headers.get('origin') || 'http://localhost:8788';
  
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  });
};

async function handleClerkProxy(
  url: URL,
  request: Request,
  platform: any,
  method: string
): Promise<Response> {
  try {
    // Récupérer la configuration depuis les variables d'environnement
    const env = platform?.env;
    const useClerkProxy = env?.USE_CLERK_PROXY === 'true';
    const clerkApiUrl = env?.CLERK_API_URL || 'https://api.clerk.com';
    const clerkSecretKey = env?.CLERK_SECRET_KEY;
    const environment = env?.ENVIRONMENT || 'dev';
    
    // Récupérer l'origine pour CORS
    const origin = request.headers.get('origin') || 'http://localhost:8788';

    console.log(`🔍 [Clerk Proxy] ${method} request to:`, url.pathname);
    console.log('🔍 [Clerk Proxy] Environment:', environment);
    console.log('🔍 [Clerk Proxy] USE_CLERK_PROXY:', useClerkProxy);
    console.log('🔍 [Clerk Proxy] Target API:', clerkApiUrl);

    // Vérifier que la clé secrète est disponible
    if (!clerkSecretKey) {
      console.error('❌ [Clerk Proxy] CLERK_SECRET_KEY not found in environment');
      return new Response(JSON.stringify({ error: 'Clerk configuration missing' }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    // Extraire le path depuis l'URL (tout après /api/clerk-proxy/)
    const pathMatch = url.pathname.match(/\/api\/clerk-proxy\/(.*)$/);
    const path = pathMatch ? pathMatch[1] : 'v1/client';
    
    // Construire l'URL de destination
    const targetUrl = new URL(`/${path}`, clerkApiUrl);
    
    // Copier les paramètres de requête
    url.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    console.log('🔍 [Clerk Proxy] Target URL:', targetUrl.toString());

    // Préparer les headers pour la requête vers Clerk
    const headers = new Headers();
    
    // Copier les headers importants de la requête originale
    const importantHeaders = [
      'content-type',
      'user-agent',
      'accept',
      'accept-language',
      'cache-control'
    ];
    
    importantHeaders.forEach(headerName => {
      const value = request.headers.get(headerName);
      if (value) {
        headers.set(headerName, value);
      }
    });

    // Ajouter l'authentification Clerk
    headers.set('Authorization', `Bearer ${clerkSecretKey}`);

    // Préparer le body de la requête si nécessaire
    let body: string | FormData | null = null;
    if (method !== 'GET' && method !== 'DELETE') {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = await request.text();
      } else if (contentType?.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    // Effectuer la requête vers l'API Clerk
    const clerkResponse = await fetch(targetUrl.toString(), {
      method,
      headers,
      body,
    });

    console.log('🔍 [Clerk Proxy] Clerk response status:', clerkResponse.status);

    // Copier la réponse de Clerk
    const responseBody = await clerkResponse.text();
    const responseHeaders = new Headers();

    // Copier les headers de réponse importants
    const responseHeadersToCopy = [
      'content-type',
      'cache-control',
      'expires',
      'last-modified',
      'etag'
    ];

    responseHeadersToCopy.forEach(headerName => {
      const value = clerkResponse.headers.get(headerName);
      if (value) {
        responseHeaders.set(headerName, value);
      }
    });

    // Ajouter les headers CORS
    responseHeaders.set('Access-Control-Allow-Origin', origin);
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');

    return new Response(responseBody, {
      status: clerkResponse.status,
      statusText: clerkResponse.statusText,
      headers: responseHeaders
    });

  } catch (error) {
    console.error('❌ [Clerk Proxy] Error:', error);
    
    const origin = request.headers.get('origin') || 'http://localhost:8788';
    
    return new Response(JSON.stringify({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }
}