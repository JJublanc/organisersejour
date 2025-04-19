import { getUserFromRequest, type User } from '$lib/auth';

export const prerender = false;

/**
 * Server-side load function to check authentication
 * This runs on every request to extract user information from Cloudflare Access JWT
 */
export async function load({ request, platform }) {
  // Check if authentication is enabled (based on environment variable)
  // Try to get from Vite env first (development), then from platform.env (production)
  const authEnabled = import.meta.env.VITE_AUTH_ENABLED === 'true' || platform?.env?.AUTH_ENABLED === 'true';
  
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
      authEnabled
    };
  }
  
  // Get user from Cloudflare Access JWT
  const user = getUserFromRequest(request);
  
  return {
    user,
    authEnabled
  };
}