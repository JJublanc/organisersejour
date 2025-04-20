// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Env } from '../functions/api/hello'; // Import the Env type
import type { User } from '$lib/auth'; // Import the User type

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null; // Add the user property
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env; // Define the env property
		}
	}
}

export {};
