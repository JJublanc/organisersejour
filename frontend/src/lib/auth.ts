/**
 * Authentication utilities for Cloudflare Access integration
 */

/**
 * Interface for user information
 */
export interface User {
  email: string;
  id: string;
  name: string;
  authenticated: boolean;
}

/**
 * Interface for JWT payload
 */
interface JwtPayload {
  email?: string;
  sub?: string;
  name?: string;
  [key: string]: any;
}

/**
 * Parse a JWT token to extract user information
 * @param token - The JWT token
 * @returns The decoded token payload or null if invalid
 */
export function parseJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  
  try {
    // Split the token and get the payload (second part)
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    // Convert base64url to base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode and parse as JSON
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

/**
 * Get user information from Cloudflare Access JWT
 * @param request - The incoming request
 * @returns User information or null if not authenticated
 */
export function getUserFromRequest(request: Request): User | null {
  // Cloudflare Access sets these headers for authenticated requests
  // In Pages, the JWT is often in a cookie named CF_Authorization
  let jwt = request.headers.get('CF-Access-JWT-Assertion');

  if (!jwt) {
    // If header is not present, try to get it from the cookie
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
      const cookies = cookieHeader.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'CF_Authorization') {
          jwt = value;
          break;
        }
      }
    }
  }

  if (!jwt) {
    return null;
  }

  const payload = parseJwt(jwt);
  if (!payload) {
    return null;
  }

  return {
    email: payload.email || '',
    id: payload.sub || '',
    name: payload.name || payload.email || '',
    authenticated: true
  };
}

/**
 * Check if a user is authenticated
 * @param user - The user object
 * @returns True if the user is authenticated
 */
export function isAuthenticated(user: User | null): boolean {
  return !!user && user.authenticated === true;
}