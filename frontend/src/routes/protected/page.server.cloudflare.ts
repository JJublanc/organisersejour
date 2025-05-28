import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
  const { user, authEnabled } = await parent();

  // If authentication is enabled and the user is not logged in, redirect
  if (authEnabled && !user) {
    // In Clerk, we can redirect to a sign-in page or let the client handle it
    throw redirect(302, '/'); // Redirect to home where Clerk can handle sign-in
  }

  // If user is authenticated or auth is disabled, allow access
  return {
    message: 'Cette page est protégée. Vous êtes authentifié avec Clerk !'
  };
};