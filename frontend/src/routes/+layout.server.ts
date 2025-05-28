import { initializeClerk, getUserFromClerk, type User } from '$lib/clerk-auth';
import { redirect } from '@sveltejs/kit';
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
  
  // Get auth configuration from locals (set by hooks)
  const authEnabled = locals.authEnabled ?? (platform?.env?.AUTH_ENABLED === 'true');
  const clerkPublishableKey = locals.clerkPublishableKey ?? platform?.env?.CLERK_PUBLISHABLE_KEY;
  
  if (!authEnabled) {
    // If auth is disabled (e.g., in development), return a mock user
    const mockUser: User = {
      email: 'dev@example.com',
      id: 'dev-user',
      name: 'Development User',
      authenticated: true
    };
    
    return {
      user: mockUser,
      authEnabled,
      clerkPublishableKey: null
    };
  }
  
  if (!clerkPublishableKey) {
    console.error("[Layout Load] CLERK_PUBLISHABLE_KEY not found in environment");
    return {
      user: null,
      authEnabled,
      clerkPublishableKey: null
    };
  }
  
  // Pour Clerk, l'authentification se fait côté client
  return {
    user: null, // L'utilisateur sera géré par Clerk côté client
    authEnabled,
    clerkPublishableKey
  };
}