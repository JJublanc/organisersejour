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
export const load: LayoutServerLoad = async ({ request, platform, url }) => {
  // Check if the current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => url.pathname === route);
  
  // Check if authentication is enabled (based on environment variable)
  const platformAuthEnabled = platform?.env?.AUTH_ENABLED;
  console.log(`[Layout Load] platform.env.AUTH_ENABLED: ${platformAuthEnabled}`);
  const authEnabled = platformAuthEnabled === 'true';
  console.log(`[Layout Load] authEnabled evaluated to: ${authEnabled}`);
  
  if (!authEnabled) {
    console.log("[Layout Load] Auth disabled, creating mock user.");
    // If auth is disabled (e.g., in development), return a mock user
    const mockUser: User = {
      email: 'dev@example.com',
      id: 'dev-user',
      name: 'Development User',
      authenticated: true
    };
    
    console.log("[Layout Load] Returning mock user:", mockUser);
    return {
      user: mockUser,
      authEnabled,
      clerkPublishableKey: null
    };
  }
  
  // Get Clerk publishable key from environment
  const clerkPublishableKey = platform?.env?.CLERK_PUBLISHABLE_KEY;
  
  if (!clerkPublishableKey) {
    console.error("[Layout Load] CLERK_PUBLISHABLE_KEY not found in environment");
    return {
      user: null,
      authEnabled,
      clerkPublishableKey: null
    };
  }
  
  // Pour Clerk, l'authentification se fait côté client
  console.log("[Layout Load] Returning Clerk configuration");
  
  return {
    user: null, // L'utilisateur sera géré par Clerk côté client
    authEnabled,
    clerkPublishableKey
  };
}