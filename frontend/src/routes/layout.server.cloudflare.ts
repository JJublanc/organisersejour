import { initializeClerk, getUserFromClerk, type User } from '$lib/clerk-auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const prerender = false;

// Define public routes that don't require authentication
const PUBLIC_ROUTES: string[] = [
  // You can add public routes here if needed
  // Example: '/login', '/about', '/terms'
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
  
  let user: User | null = null;
  
  try {
    // Initialize Clerk
    await initializeClerk(clerkPublishableKey);
    
    // Get user from Clerk
    user = getUserFromClerk();
    
    console.log("[Layout Load] User object from Clerk:", user);
  } catch (error) {
    console.error("[Layout Load] Error with Clerk authentication:", error);
  }

  // If authentication is enabled and the user is not authenticated and the route is not public
  if (authEnabled && (!user || !user.authenticated) && !isPublicRoute) {
    console.log("[Layout Load] User not authenticated. Clerk should handle redirection.");
    // Let Clerk handle the authentication flow
    // Individual pages can redirect to sign-in if needed
  }
  
  return {
    user,
    authEnabled,
    clerkPublishableKey
  };
}