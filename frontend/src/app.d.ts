// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { D1Database } from '@cloudflare/workers-types'; // Import D1 type
import type { User } from '$lib/auth'; // Import the User type

// Define the Env interface for Cloudflare bindings
interface Env {
  DB: D1Database;
  // Add other bindings like KV namespaces, secrets, etc., here if needed
  // Example: MY_KV: KVNamespace;
  // Example: MY_SECRET: string;
  AUTH_ENABLED?: string; // Keep existing optional vars
  ENVIRONMENT?: string; // Keep existing optional vars
  DB_PREPROD?: D1Database; // Keep existing optional vars
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null; // Add the user property
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env; // Use the locally defined Env interface
		}
	}
}

export {};
