/**
 * Server-side Clerk authentication utilities
 */

import type { User } from '$lib/clerk-auth';

/**
 * Verify a Clerk session token and extract user information
 * This is a simplified implementation for server-side verification
 */
export async function verifyClerkToken(sessionToken: string, secretKey: string): Promise<User | null> {
  if (!sessionToken || !secretKey) {
    return null;
  }

  try {
    // Verify the session token with Clerk's API
    const response = await fetch(`https://api.clerk.com/v1/sessions/${sessionToken}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.log('[Clerk Auth] Session verification failed:', response.status);
      return null;
    }

    const sessionData = await response.json();
    
    if (!sessionData || sessionData.status !== 'active') {
      console.log('[Clerk Auth] Session is not active');
      return null;
    }

    // Get user information from the session
    const userId = sessionData.user_id;
    if (!userId) {
      console.log('[Clerk Auth] No user ID in session');
      return null;
    }

    // Fetch user details
    const userResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      }
    });

    if (!userResponse.ok) {
      console.log('[Clerk Auth] Failed to fetch user details:', userResponse.status);
      return null;
    }

    const clerkUser = await userResponse.json();
    
    return {
      id: clerkUser.id,
      email: clerkUser.email_addresses?.[0]?.email_address || '',
      name: clerkUser.first_name && clerkUser.last_name
        ? `${clerkUser.first_name} ${clerkUser.last_name}`
        : clerkUser.first_name || clerkUser.email_addresses?.[0]?.email_address || '',
      authenticated: true
    };
  } catch (error) {
    console.error('[Clerk Auth] Error verifying session:', error);
    return null;
  }
}

/**
 * Extract session token from request headers
 */
export function extractSessionToken(request: Request): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check for Clerk session cookies
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    
    // Look for various Clerk cookie patterns
    const clerkCookiePatterns = [
      '__session=',           // Clerk's default session cookie
      '__clerk_session=',     // Alternative Clerk session cookie
      '__clerk_db_jwt=',      // Clerk database JWT
      'clerk-session='        // Another possible pattern
    ];
    
    for (const cookie of cookies) {
      for (const pattern of clerkCookiePatterns) {
        if (cookie.startsWith(pattern)) {
          const token = cookie.substring(pattern.length);
          if (token && token.length > 10) { // Basic validation
            return token;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(request: Request, env: any): Promise<User | null> {
  const secretKey = env?.CLERK_SECRET_KEY;
  if (!secretKey) {
    console.error('[Clerk Auth] CLERK_SECRET_KEY not found in environment');
    return null;
  }

  const sessionToken = extractSessionToken(request);
  if (!sessionToken) {
    return null;
  }

  return await verifyClerkToken(sessionToken, secretKey);
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(request: Request, env: any): Promise<User> {
  const user = await getAuthenticatedUser(request, env);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}