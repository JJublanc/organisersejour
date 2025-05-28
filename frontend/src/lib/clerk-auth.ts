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
 * Initialize Clerk with publishable key - Optimized version
 */
let clerk: any = null;
let clerkPromise: Promise<any> | null = null;

export async function initializeClerk(publishableKey: string, options?: any): Promise<any> {
  if (typeof window === 'undefined') {
    // Server-side: return mock for now
    return null;
  }
  
  // Return existing instance if already initialized
  if (clerk) {
    return clerk;
  }
  
  // Return existing promise if initialization is in progress
  if (clerkPromise) {
    return clerkPromise;
  }
  
  // Start initialization
  clerkPromise = (async () => {
    try {
      // Preload Clerk script for faster loading
      await preloadClerkScript();
      
      // Dynamic import with timeout
      const { Clerk } = await Promise.race([
        import('@clerk/clerk-js'),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Clerk import timeout')), 10000)
        )
      ]) as any;
      
      clerk = new Clerk(publishableKey, {
        ...options,
        // Optimize loading options
        appearance: {
          ...options?.appearance,
          layout: {
            ...options?.appearance?.layout,
            logoImageUrl: undefined, // Remove logo for faster loading
          }
        }
      });
      
      // Load with timeout
      await Promise.race([
        clerk.load(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Clerk load timeout')), 15000)
        )
      ]);
      
      console.log('✅ Clerk initialized successfully');
      return clerk;
    } catch (error) {
      console.error('❌ Clerk initialization failed:', error);
      clerkPromise = null; // Reset promise to allow retry
      throw error;
    }
  })();
  
  return clerkPromise;
}

/**
 * Preload Clerk script for faster initialization
 */
async function preloadClerkScript(): Promise<void> {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="clerk"]')) {
      resolve();
      return;
    }
    
    // Create preload link
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = 'https://js.clerk.com/v4/clerk.js';
    link.onload = () => resolve();
    link.onerror = () => resolve(); // Continue even if preload fails
    
    document.head.appendChild(link);
    
    // Fallback timeout
    setTimeout(resolve, 2000);
  });
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
  console.log('🔐 Attempting to redirect to sign in...');
  if (clerk && clerk.loaded) {
    console.log('✅ Clerk loaded, redirecting...');
    clerk.redirectToSignIn();
  } else if (clerk) {
    console.log('⏳ Clerk not fully loaded, opening sign in...');
    clerk.openSignIn();
  } else {
    console.warn('❌ Clerk not initialized, using fallback');
    // Fallback: redirect to a sign-in page or show modal
    window.location.href = '/sign-in';
  }
}

/**
 * Redirect to sign up
 */
export function redirectToSignUp(): void {
  console.log('🔐 Attempting to redirect to sign up...');
  if (clerk && clerk.loaded) {
    console.log('✅ Clerk loaded, redirecting...');
    clerk.redirectToSignUp();
  } else if (clerk) {
    console.log('⏳ Clerk not fully loaded, opening sign up...');
    clerk.openSignUp();
  } else {
    console.warn('❌ Clerk not initialized, using fallback');
    // Fallback: redirect to a sign-up page or show modal
    window.location.href = '/sign-up';
  }
}

/**
 * Open sign in modal
 */
export function openSignIn(): void {
  console.log('🔐 Opening sign in modal...');
  if (clerk) {
    clerk.openSignIn();
  } else {
    console.warn('❌ Clerk not initialized, using redirect fallback');
    redirectToSignIn();
  }
}

/**
 * Open sign up modal
 */
export function openSignUp(): void {
  console.log('🔐 Opening sign up modal...');
  if (clerk) {
    clerk.openSignUp();
  } else {
    console.warn('❌ Clerk not initialized, using redirect fallback');
    redirectToSignUp();
  }
}