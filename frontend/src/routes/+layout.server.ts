import type { User } from '$lib/clerk-auth';
import type { LayoutServerLoad } from './$types';

export const prerender = false;

// Define public routes that don't require authentication
const PUBLIC_ROUTES: string[] = [
  '/',
  '/trips',
  '/recipes',
  '/ingredients',
  '/protected' // Temporairement public pour tester Clerk
];

/**
 * Server-side load function to check authentication with Clerk
 * This runs on every request to extract user information from Clerk
 */
export const load: LayoutServerLoad = async ({ locals, platform, url }) => {
  // Check if the current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => url.pathname === route);
  
  // Get environment variables
  const env = platform?.env;
  const clerkPublishableKey = locals.clerkPublishableKey ?? env?.CLERK_PUBLISHABLE_KEY;
  
  // Get proxy configuration
  const useClerkProxy = env?.USE_CLERK_PROXY === 'true';
  const clerkProxyUrl = env?.CLERK_PROXY_URL;
  const clerkApiUrl = env?.CLERK_API_URL || 'https://api.clerk.com';
  const environment = env?.ENVIRONMENT || 'dev';
  
  // 🔍 DIAGNOSTIC LOGS
  console.log('🔍 [DIAGNOSTIC] Layout Server Load');
  console.log('🔍 [DIAGNOSTIC] URL:', url.pathname);
  console.log('🔍 [DIAGNOSTIC] Environment:', environment);
  console.log('🔍 [DIAGNOSTIC] Platform env keys:', env ? Object.keys(env) : 'No platform.env');
  console.log('🔍 [DIAGNOSTIC] Clerk key from platform:', env?.CLERK_PUBLISHABLE_KEY ? 'Found' : 'Not found');
  console.log('🔍 [DIAGNOSTIC] Clerk key from locals:', locals.clerkPublishableKey ? 'Found' : 'Not found');
  console.log('🔍 [DIAGNOSTIC] Final clerk key:', clerkPublishableKey ? `${clerkPublishableKey.substring(0, 20)}...` : 'None');
  console.log('🔍 [DIAGNOSTIC] Use Clerk Proxy:', useClerkProxy);
  console.log('🔍 [DIAGNOSTIC] Clerk Proxy URL:', clerkProxyUrl);
  console.log('🔍 [DIAGNOSTIC] Clerk API URL:', clerkApiUrl);
  
  if (!clerkPublishableKey) {
    console.error("❌ [Layout Load] CLERK_PUBLISHABLE_KEY not found in environment");
    return {
      user: null,
      authEnabled: true,
      clerkPublishableKey: null,
      clerkConfig: {
        useProxy: false,
        proxyUrl: null,
        apiUrl: clerkApiUrl,
        environment
      }
    };
  }
  
  // Vérifier le type de clé
  if (clerkPublishableKey.includes('organisersejour.pages.dev')) {
    console.error('❌ [DIAGNOSTIC] PROBLÈME CONFIRMÉ: Clé Clerk avec domaine personnalisé détectée dans layout server!');
  }
  
  // Return user from server-side authentication (set by hooks) + proxy config
  return {
    user: locals.user, // User verified by Clerk on server-side
    authEnabled: true, // Always use Clerk authentication
    clerkPublishableKey,
    clerkConfig: {
      useProxy: useClerkProxy,
      proxyUrl: useClerkProxy ? clerkProxyUrl : undefined, // Ne pas passer l'URL si proxy désactivé
      apiUrl: clerkApiUrl,
      environment
    }
  };
}