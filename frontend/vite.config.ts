import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['@clerk/clerk-js']
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// Separate Clerk into its own chunk for better caching
					clerk: ['@clerk/clerk-js']
				}
			}
		}
	},
	ssr: {
		noExternal: ['@clerk/clerk-js']
	}
});
