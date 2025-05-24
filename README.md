# 🧑‍🍳 Organiser des séjours

A lightweight web application to organize and manage meal planning during vacation stays. Built with modern, serverless technologies to ensure fast and scalable performance.

🌐 Stack Overview

Frontend: SvelteKit

Hosting: Cloudflare Pages

Backend API: SvelteKit API routes (deployed as Cloudflare Workers via adapter-cloudflare)

Database: Cloudflare D1 (SQLite-based)

Monitoring: Cloudflare Analytics

Authentication: Cloudflare Access with One-Time PIN (email-based authentication)

CI/CD: Git-based deployments with Cloudflare Pages (CI/CD pipeline will come later)

🚀 Getting Started

Prerequisites

Node.js (v18+ recommended)

Wrangler CLI (npm install -g wrangler)

A Cloudflare account

A D1 database created via the Cloudflare Dashboard or wrangler

💠 Project Structure

organisersejour/
├── frontend/               # SvelteKit frontend
│   ├── src/                # SvelteKit app source
│   │   ├── routes/         # SvelteKit routes (pages and API endpoints)
│   │   │   ├── api/        # API routes
│   │   │   └── protected/  # Protected routes (require authentication)
│   │   └── lib/            # Shared libraries and utilities
│   ├── schema.sql          # SQL schema for D1 database
│   ├── wrangler.toml       # Wrangler config for D1 and environment variables
│   └── ...

🧪 Local Development

1. Clone the repository and install dependencies

```bash
git clone https://github.com/yourusername/organisersejour.git
cd organisersejour/frontend
npm install
```

2. Configure environment variables

Create a `.env` file in the frontend/ folder:

```
# Development environment variables
VITE_AUTH_ENABLED=false
```

3. Start the development server

```bash
npm run dev
```

This starts the SvelteKit development server, which serves both the frontend and API routes.

4. Access the application

Open your browser and navigate to:
```
http://localhost:5173
```

5. Testing with Cloudflare bindings (optional)

If you want to test with Cloudflare D1 and other bindings, you can use:

```bash
npm run dev:cf
```

This requires:
- Wrangler CLI installed (`npm install -g wrangler`)
- A Cloudflare account
- Proper configuration in `wrangler.toml` and `.dev.vars`

🔍 API Example

The application exposes an API endpoint at:

GET /api/hello

This endpoint is implemented as a SvelteKit API route in `src/routes/api/hello/+server.ts`.

Returns:

```json
{
  "message": "Hello from D1 🎉"
}
```

📦 Build for Production

```bash
npm run build
```

This will use the Cloudflare adapter to generate a deployable site.

Make sure you're using @sveltejs/adapter-static or @sveltejs/adapter-cloudflare depending on the strategy.

🚀 Deployment to Cloudflare Pages

1. Push your code to a GitHub repository

2. Connect your repo to Cloudflare Pages

Choose the frontend/ directory as the project root

Set build command: npm run build

Set build output directory: .svelte-kit/cloudflare

Configure wrangler.toml for Pages Functions

Set up your D1 database binding in the Pages project settings

After pushing to main or production, your app will be deployed automatically 🎉

## Debug

Connect to the log of the application

```bash
wrangler pages deployment tail
```
# Database

Create a new database
```bash
wrangler d1 create <db_name>
```

## Database Migrations

This project uses a custom script to manage database migrations, located at `frontend/scripts/apply-neon-migrations.js`.
Migration files are SQL files located in the `frontend/migrations/` directory.

### Creating a New Migration

1.  Create a new SQL file in the `frontend/migrations/` directory.
    The filename should follow the pattern `XXXX_description.sql`, where `XXXX` is the sequential migration number.
    Example: `frontend/migrations/0025_add_new_feature.sql`

2.  Write your SQL DDL statements in this file. Example:
    ```sql
    -- frontend/migrations/0025_add_new_feature.sql
    CREATE TABLE new_feature (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    ALTER TABLE existing_table ADD COLUMN new_column TEXT;
    ```

### Applying Migrations

Ensure your environment variables are correctly set up in `frontend/.env` for local development (especially `NEON_DEV_URL` and `NEON_PASSWORD`).
For CI/CD or other environments, ensure the corresponding `NEON_PREPROD_URL` or `NEON_PROD_URL` (and `NEON_PASSWORD` if not in the URL) are set as environment variables.

The following npm scripts (defined in `frontend/package.json`) are used to apply migrations:

*   **Development:**
    Navigate to the `frontend` directory first.
    ```bash
    cd frontend
    npm run db:migrate:dev
    ```
    This command uses the `NEON_DEV_URL` environment variable, loaded via `dotenv` from `frontend/.env`.

*   **Pre-production:**
    Navigate to the `frontend` directory first.
    ```bash
    cd frontend
    npm run db:migrate:preprod
    ```
    This command uses the `NEON_PREPROD_URL` environment variable.

*   **Production:**
    Navigate to the `frontend` directory first.
    ```bash
    cd frontend
    npm run db:migrate:prod
    ```
    This command uses the `NEON_PROD_URL` environment variable.

The script `frontend/scripts/apply-neon-migrations.js` handles:
- Creating the `applied_migrations` table if it doesn't exist.
- Checking which migrations have already been applied.
- Applying pending schema-altering migrations in sequence.
- Recording applied migrations in the `applied_migrations` table.

📊 Monitoring

Cloudflare Pages integrates with Cloudflare Analytics by default.

Additional monitoring via Cloudflare Logs and custom logging coming soon.

🔒 Authentication

Authentication is implemented using Cloudflare Access with One-Time PIN (email-based authentication). This provides:

- Secure access to the application
- Email-based authentication (no passwords required)
- Protected routes that require authentication

The authentication flow is:
1. User visits the application
2. If not authenticated, they're redirected to Cloudflare Access login
3. User enters their email and receives a one-time PIN
4. After authentication, they're redirected back to the application

📋 Roadmap

🧑‍💻 Contributing

Coming soon!

📄 License

Coming soon!
