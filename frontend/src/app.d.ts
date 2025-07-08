// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { User } from '$lib/clerk-auth'; // Import the User type from Clerk auth

// Define the Env interface for Cloudflare bindings
interface Env {
  // Add other bindings like KV namespaces, secrets, etc., here if needed
  // Example: MY_KV: KVNamespace;
  // Example: MY_SECRET: string;
  AUTH_ENABLED?: string;
  ENVIRONMENT?: string;
  // Neon PostgreSQL environment variables
  NEON_DEV_URL?: string;
  NEON_PREPROD_URL?: string;
  NEON_PROD_URL?: string;
  NEON_PASSWORD?: string;
  // Clerk environment variables
  CLERK_PUBLISHABLE_KEY?: string;
  CLERK_SECRET_KEY?: string;
  // Clerk Proxy configuration
  USE_CLERK_PROXY?: string;
  CLERK_PROXY_URL?: string;
  CLERK_API_URL?: string;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null; // Add the user property
			clerkPublishableKey?: string;
			authEnabled?: boolean;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env; // Use the locally defined Env interface
		}
	}
}

export {};
