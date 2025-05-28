import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Ne pas initialiser Clerk côté serveur - cela se fait côté client
  // Juste passer les variables d'environnement nécessaires
  
  // Attach environment info to locals for client-side use
  event.locals.clerkPublishableKey = event.platform?.env?.CLERK_PUBLISHABLE_KEY || 
                                     process.env.CLERK_PUBLISHABLE_KEY;
  event.locals.authEnabled = event.platform?.env?.AUTH_ENABLED === 'true';

  // Resolve the request without blocking
  const response = await resolve(event);

  return response;
};