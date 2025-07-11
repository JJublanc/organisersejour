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
    
    // Configuration pour éviter les redirections vers accounts.organisersejour.com
    // Utiliser des pages intégrées au lieu de redirections externes
    clerkOptions.signInUrl = '/sign-in';
    clerkOptions.signUpUrl = '/sign-up';
    clerkOptions.afterSignInUrl = '/';
    clerkOptions.afterSignUpUrl = '/';
    
    // Forcer l'utilisation du domaine principal sans sous-domaine
    clerkOptions.isSatellite = false;
    clerkOptions.domain = window.location.hostname;
    
    console.log('🔍 [DIAGNOSTIC] Initializing Clerk with options:', clerkOptions);
    clerk = new Clerk(publishableKey, clerkOptions);
    
    console.log('🔍 [DIAGNOSTIC] Clerk instance created, loading...');
    await clerk.load();
    console.log('🔍 [DIAGNOSTIC] Clerk loaded successfully');
    
    // Exposer Clerk globalement pour les pages de connexion/inscription
    if (typeof window !== 'undefined') {
      (window as any).Clerk = clerk;
      console.log('🔍 [DIAGNOSTIC] Clerk exposé globalement sur window.Clerk');
    }
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
 * Redirect to sign in - utilise nos pages intégrées au lieu du Dashboard Clerk
 */
export function redirectToSignIn(): void {
  console.log('[Clerk] redirectToSignIn called - redirecting to /sign-in');
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-in';
  }
}

/**
 * Redirect to sign up - utilise nos pages intégrées au lieu du Dashboard Clerk
 */
export function redirectToSignUp(): void {
  console.log('[Clerk] redirectToSignUp called - redirecting to /sign-up');
  if (typeof window !== 'undefined') {
    window.location.href = '/sign-up';
  }
}