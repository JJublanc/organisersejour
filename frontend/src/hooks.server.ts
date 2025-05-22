import { getUserFromRequest } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Get user from Cloudflare Access JWT (from header or cookie)
  const user = getUserFromRequest(event.request);

  // Attach user to locals
  event.locals.user = user;

  // Resolve the request
  const response = await resolve(event);

  return response;
};