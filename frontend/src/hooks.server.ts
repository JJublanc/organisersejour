import type { User } from '$lib/clerk-auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Pour Clerk, l'authentification se fait côté client
  // On ne retourne pas d'utilisateur côté serveur
  event.locals.user = null;

  // Resolve the request
  const response = await resolve(event);

  return response;
};