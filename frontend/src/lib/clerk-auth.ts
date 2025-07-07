/**
 * Authentication utilities for Clerk integration
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
 * Initialize Clerk with publishable key
 */
let clerk: any = null;

export async function initializeClerk(publishableKey: string, options?: any): Promise<any> {
  if (typeof window === 'undefined') {
    // Server-side: return mock for now
    return null;
  }
  
  if (!clerk) {
    // Dynamic import to avoid SSR issues
    const { Clerk } = await import('@clerk/clerk-js');
    
    // SOLUTION PROXY : Utilise notre proxy partout car le custom domain cause des CORS
    const isLocalhost = window.location.hostname === 'localhost';
    const proxyUrl = isLocalhost
      ? 'http://localhost:8788/api/clerk-proxy'
      : 'https://organisersejour.pages.dev/api/clerk-proxy';
      
    const clerkOptions = {
      ...options,
      proxyUrl
    };
    
    console.log('[Clerk] PROXY: Utilisation du proxy pour contourner le custom domain');
    console.log('[Clerk] Proxy URL:', proxyUrl);
    
    clerk = new Clerk(publishableKey, clerkOptions);
    await clerk.load();
  }
  return clerk;
}

/**
 * Get the current Clerk instance
 */
export function getClerk(): any {
  return clerk;
}

/**
 * Get user information from Clerk
 * @returns User information or null if not authenticated
 */
export function getUserFromClerk(): User | null {
  if (!clerk || !clerk.user) {
    return null;
  }

  const clerkUser = clerk.user;
  
  return {
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress || '',
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

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  if (clerk) {
    await clerk.signOut();
  }
}

/**
 * Redirect to sign in
 */
export function redirectToSignIn(): void {
  if (clerk) {
    clerk.redirectToSignIn();
  }
}

/**
 * Redirect to sign up
 */
export function redirectToSignUp(): void {
  if (clerk) {
    clerk.redirectToSignUp();
  }
}