import { getUserFromRequest, type User } from '$lib/auth';

export const prerender = false;

/**
 * Server-side load function to check authentication
 * This runs on every request to extract user information from Cloudflare Access JWT
 */
export async function load({ request, platform }) {
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
  const user = getUserFromRequest(request);
  
  console.log("[Layout Load] Auth enabled, returning user from request:", user); // Log returned real user
  return {
    user,
    authEnabled
  };
}