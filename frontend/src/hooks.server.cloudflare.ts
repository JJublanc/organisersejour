import type { Handle } from '@sveltejs/kit';
import type { User } from '$lib/clerk-auth';
import { getAuthenticatedUser } from '$lib/server/clerk-auth';

export const handle: Handle = async ({ event, resolve }) => {
  // Get Clerk configuration from environment
  const clerkPublishableKey = event.platform?.env?.CLERK_PUBLISHABLE_KEY ||
                              process.env.CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = event.platform?.env?.CLERK_SECRET_KEY ||
                         process.env.CLERK_SECRET_KEY;

  console.log('[Hooks] URL:', event.url.href);
  console.log('[Hooks] Platform env keys:', event.platform?.env ? Object.keys(event.platform.env) : 'No platform env');
  console.log('[Hooks] CLERK_PUBLISHABLE_KEY from platform:', event.platform?.env?.CLERK_PUBLISHABLE_KEY ? 'Found' : 'Not found');
  console.log('[Hooks] CLERK_PUBLISHABLE_KEY from process:', process.env.CLERK_PUBLISHABLE_KEY ? 'Found' : 'Not found');
  console.log('[Hooks] Final clerkPublishableKey:', clerkPublishableKey ? `${clerkPublishableKey.substring(0, 20)}...` : 'Not found');

  // Attach environment info to locals for client-side use
  event.locals.clerkPublishableKey = clerkPublishableKey;
  event.locals.authEnabled = true; // Always use Clerk authentication

  // Try to authenticate the user from the request
  let user: User | null = null;
  
  if (clerkSecretKey) {
    try {
      user = await getAuthenticatedUser(event.request, event.platform?.env);
      if (user) {
        console.log(`[Auth] Authenticated user: ${user.id} (${user.email})`);
      }
    } catch (error) {
      console.log('[Auth] Authentication failed:', error);
      // Don't throw error, just continue without user
    }
  } else {
    console.warn('[Auth] CLERK_SECRET_KEY not found, server-side auth disabled');
  }

  event.locals.user = user;

  // Resolve the request
  const response = await resolve(event);

  return response;
};