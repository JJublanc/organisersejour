import { initializeClerk, getUserFromClerk, type User } from '$lib/clerk-auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Get Clerk publishable key from environment
  const clerkPublishableKey = event.platform?.env?.CLERK_PUBLISHABLE_KEY || 
                              process.env.CLERK_PUBLISHABLE_KEY;

  let user: User | null = null;

  if (clerkPublishableKey) {
    try {
      // Initialize Clerk if we have a publishable key
      await initializeClerk(clerkPublishableKey);
      
      // Get user from Clerk
      user = getUserFromClerk();
    } catch (error) {
      console.error('Error initializing Clerk:', error);
    }
  }

  // Attach user to locals
  event.locals.user = user;

  // Resolve the request
  const response = await resolve(event);

  return response;
};