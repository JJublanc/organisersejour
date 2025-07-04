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

For local development with Cloudflare Pages (recommended):

```bash
npm run dev:local
```

This command builds the application and runs it using Wrangler Pages dev server, which simulates the Cloudflare environment locally.

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment. This project is configured to use `@sveltejs/adapter-cloudflare`.

## Project-Specific Information

### Environment Variables

For local development, you need to configure environment variables for database connections and authentication.

#### Local Development Setup

Create a `.dev.vars` file in this `frontend/` directory for Wrangler/Cloudflare Pages development:

Example `frontend/.dev.vars`:
```
NEON_DEV_URL=postgresql://user:password@host:port/database_dev?sslmode=require
NEON_PREPROD_URL=postgresql://user:password@host:port/database_preprod?sslmode=require
NEON_PROD_URL=postgresql://user:password@host:port/database_prod?sslmode=require
NEON_PASSWORD=your_db_password
AUTH_ENABLED=false
```

**Important Notes:**
- The `.dev.vars` file is used by Wrangler for local development and should **not** be committed to version control
- `AUTH_ENABLED=false` disables Cloudflare Access authentication only in local development
- In production, authentication remains enabled as configured in `wrangler.toml`

#### Legacy .env Support

For compatibility with Node.js scripts (like database migrations), you can also maintain a `.env` file in the project root:

Example `/.env` (project root):
```
NEON_DEV_URL=postgresql://user:password@host:port/database_dev?sslmode=require
NEON_PREPROD_URL=postgresql://user:password@host:port/database_preprod?sslmode=require
NEON_PROD_URL=postgresql://user:password@host:port/database_prod?sslmode=require
NEON_PASSWORD=your_db_password
```

### Database Migrations

Database migrations are managed via SQL files in the `migrations/` directory and applied using custom npm scripts.

-   **`npm run db:migrate:dev`**: Applies migrations to the development database.
-   **`npm run db:migrate:preprod`**: Applies migrations to the pre-production database.
-   **`npm run db:migrate:prod`**: Applies migrations to the production database.

These scripts use the `scripts/apply-neon-migrations.js` Node.js script. Ensure the appropriate `NEON_..._URL` and `NEON_PASSWORD` environment variables are set (either in the root `.env` file for local dev or directly in the CI/CD environment).

**Note:** Database migration scripts use the root `.env` file, while the Wrangler development server uses `frontend/.dev.vars`.

For more detailed information on the project structure, deployment, and other aspects, please refer to the main [README.md](../../README.md) at the root of the project.
