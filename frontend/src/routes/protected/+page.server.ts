import { redirect } from '@sveltejs/kit';
import type { LayoutData } from '../$types'; // Import from parent layout types

export const load = async ({ parent }: { parent: () => Promise<LayoutData> }) => {
  const { user, authEnabled } = await parent();

  // If authentication is enabled and the user is not logged in, redirect
  // Cloudflare Access should handle the redirect to login, but this is a fallback
  if (authEnabled && !user) {
    // In a real Cloudflare Access setup, the user would be redirected
    // to the Access login page automatically before reaching here.
    // This redirect is a safeguard or could point to a custom login info page.
    throw redirect(302, '/'); // Redirect to home or a specific login info page
  }

  // If user is authenticated or auth is disabled, allow access
  return {
    message: 'This is a protected page. You are authenticated!'
  };
};