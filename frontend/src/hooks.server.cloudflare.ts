import type { Handle } from '@sveltejs/kit';
import type { User } from '$lib/clerk-auth';

export const handle: Handle = async ({ event, resolve }) => {
  // Get Clerk configuration from environment
  const clerkPublishableKey = event.platform?.env?.CLERK_PUBLISHABLE_KEY || 
                              process.env.CLERK_PUBLISHABLE_KEY;

  // Attach environment info to locals for client-side use
  event.locals.clerkPublishableKey = clerkPublishableKey;
  event.locals.authEnabled = true; // Always use Clerk authentication

  // For now, we'll rely on client-side authentication
  // The user will be set by the client-side Clerk integration
  event.locals.user = null;

  // Resolve the request
  const response = await resolve(event);

  return response;
};