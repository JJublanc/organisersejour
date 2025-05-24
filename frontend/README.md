# Frontend Application (Organiser des Séjours)

This directory contains the SvelteKit frontend application for the "Organiser des Séjours" project.

## Based on SvelteKit

Everything you need to build a Svelte project, powered by SvelteKit.

### Creating a project (Initial Setup)

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
# npx create-svelte@latest

# create a new project in my-app
# npx create-svelte@latest my-app
```

### Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev
```

Or start the server and open the app in a new browser tab:

```bash
npm run dev -- --open
```

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment. This project is configured to use `@sveltejs/adapter-cloudflare`.

## Project-Specific Information

### Environment Variables

For local development, create a `.env` file in this `frontend/` directory. It should contain variables like `NEON_DEV_URL` for the development database connection string and `NEON_PASSWORD`.

Example `frontend/.env`:
```
NEON_DEV_URL="postgres://user:password@host:port/database_dev"
NEON_PASSWORD="your_db_password"
VITE_AUTH_ENABLED=false # Set to true to enable Cloudflare Access locally
```

### Database Migrations

Database migrations are managed via SQL files in the `migrations/` directory and applied using custom npm scripts.

-   **`npm run db:migrate:dev`**: Applies migrations to the development database.
-   **`npm run db:migrate:preprod`**: Applies migrations to the pre-production database.
-   **`npm run db:migrate:prod`**: Applies migrations to the production database.

These scripts use the `scripts/apply-neon-migrations.js` Node.js script. Ensure the appropriate `NEON_..._URL` and `NEON_PASSWORD` environment variables are set (either in `.env` for local dev or directly in the CI/CD environment).

For more detailed information on the project structure, deployment, and other aspects, please refer to the main [README.md](../../README.md) at the root of the project.
