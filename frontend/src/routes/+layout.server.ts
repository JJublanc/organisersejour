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
  
  // Get Clerk configuration from locals (set by hooks)
  const clerkPublishableKey = locals.clerkPublishableKey ?? platform?.env?.CLERK_PUBLISHABLE_KEY;
  
  if (!clerkPublishableKey) {
    console.error("[Layout Load] CLERK_PUBLISHABLE_KEY not found in environment");
    return {
      user: null,
      authEnabled: true,
      clerkPublishableKey: null
    };
  }
  
  // Return user from server-side authentication (set by hooks)
  return {
    user: locals.user, // User verified by Clerk on server-side
    authEnabled: true, // Always use Clerk authentication
    clerkPublishableKey
  };
}