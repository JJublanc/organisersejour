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
 * Clerk configuration options
 */
export interface ClerkOptions {
  useProxy?: boolean;
  proxyUrl?: string;
  apiUrl?: string;
  environment?: string;
}

/**
 * Initialize Clerk with publishable key and proxy support
 */
let clerk: any = null;

export async function initializeClerk(publishableKey: string, options?: ClerkOptions): Promise<any> {
  if (typeof window === 'undefined') {
    // Server-side: return mock for now
    return null;
  }
  
  // 🔍 DIAGNOSTIC LOGS
  console.log('🔍 [DIAGNOSTIC] Clerk publishableKey:', publishableKey);
  console.log('🔍 [DIAGNOSTIC] Current origin:', window.location.origin);
  console.log('🔍 [DIAGNOSTIC] Current URL:', window.location.href);
  console.log('🔍 [DIAGNOSTIC] Clerk options:', options);
  
  // Vérifier le format de la clé
  if (publishableKey.includes('organisersejour.pages.dev')) {
    console.error('❌ [DIAGNOSTIC] PROBLÈME DÉTECTÉ: Clé Clerk configurée pour domaine personnalisé!');
    console.error('❌ [DIAGNOSTIC] Cette clé ne fonctionnera qu\'en production sur organisersejour.pages.dev');
    console.error('❌ [DIAGNOSTIC] Pour le développement local, utilisez une clé pk_test_... standard');
  }
  
  if (!clerk) {
    // Dynamic import to avoid SSR issues
    const { Clerk } = await import('@clerk/clerk-js');
    
    // Préparer les options Clerk avec support du proxy
    const clerkOptions: any = { ...options };
    
    // Si le proxy est activé ET que l'URL est fournie, configurer le proxy
    if (options?.useProxy && options?.proxyUrl) {
      console.log('🔍 [DIAGNOSTIC] Proxy Clerk activé:', options.proxyUrl);
      clerkOptions.proxyUrl = options.proxyUrl;
    } else {
      console.log('🔍 [DIAGNOSTIC] Proxy Clerk désactivé - utilisation directe de l\'API Clerk');
      // Ne pas configurer proxyUrl du tout pour que Clerk utilise l'API directement
    }
    
    // Configurer l'URL de l'API si spécifiée
    if (options?.apiUrl) {
      clerkOptions.apiUrl = options.apiUrl;
    }
    
    console.log('🔍 [DIAGNOSTIC] Initializing Clerk with options:', clerkOptions);
    clerk = new Clerk(publishableKey, clerkOptions);
    
    console.log('🔍 [DIAGNOSTIC] Clerk instance created, loading...');
    await clerk.load();
    console.log('🔍 [DIAGNOSTIC] Clerk loaded successfully');
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