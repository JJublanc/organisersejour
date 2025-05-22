import { getUserFromRequest, type User } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export const prerender = false;

// Define public routes that don't require authentication
const PUBLIC_ROUTES: string[] = [
  // You can add public routes here if needed
  // Example: '/login', '/about', '/terms'
];

/**
 * Server-side load function to check authentication
 * This runs on every request to extract user information from Cloudflare Access JWT
 */
export async function load({ request, platform, url }) {
  // Check if the current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => url.pathname === route);
  // Check if authentication is enabled (based on environment variable)
  // Try to get from Vite env first (development), then from platform.env (production)
  // Use only platform.env for auth check when running via Wrangler
  const platformAuthEnabled = platform?.env?.AUTH_ENABLED;
  console.log(`[Layout Load] platform.env.AUTH_ENABLED: ${platformAuthEnabled}`); // Log raw value
  const authEnabled = platformAuthEnabled === 'true';
  console.log(`[Layout Load] authEnabled evaluated to: ${authEnabled}`); // Log evaluated value
  
  if (!authEnabled) {
      console.log("[Layout Load] Auth disabled, creating mock user."); // Log mock user creation
    // If auth is disabled (e.g., in development), return a mock user
    const mockUser: User = {
      email: 'dev@example.com',
      id: 'dev-user',
      name: 'Development User',
      authenticated: true
    };
    
    console.log("[Layout Load] Returning mock user:", mockUser); // Log returned mock user
    return {
      user: mockUser,
      authEnabled
    };
  }
  
  // Get user from Cloudflare Access JWT
  console.log(`[Layout Load] CF-Access-JWT-Assertion: ${request.headers.get('CF-Access-JWT-Assertion')}`); // Log JWT header
  const user = getUserFromRequest(request);

  console.log("[Layout Load] User object after getUserFromRequest:", user); // Log the user object
  console.log("[Layout Load] Auth enabled, returning user from request:", user); // Log returned real user

  // If authentication is enabled and the user is not authenticated and the route is not public
  if (authEnabled && (!user || !user.authenticated) && !isPublicRoute) {
    console.log("[Layout Load] User not authenticated, redirecting to login");
    // Redirect to Cloudflare Access login
    // This will automatically trigger the Cloudflare Access authentication flow
    throw redirect(302, '/');
  }
  
  return {
    user,
    authEnabled
  };
}