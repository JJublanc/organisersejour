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

## Migration

Create a new migration
```
npx wrangler d1 migrations create <db_name> <migration_name> 
```

Write the logic fo the migration in the new file `./migrations/<migration_id>_<migration_name>.sql`
Exemple :

```sql
-- Migration number: 0003 	 2025-04-13T07:17:41.951Z
-- Si la table existe déjà, la supprimer
DROP TABLE IF EXISTS messages;

-- Créer la table "messages" sans contrainte NOT NULL sur la colonne content
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT
);

-- Insérer des données par défaut dans la table "messages"
INSERT INTO messages (text) VALUES ('Hello from D1 🎉');
```

Apply the migration locally

```bash
npx wrangler d1 migrations apply <db_name> 
```

Apply the migration remotely

```bash
npx wrangler d1 migrations apply <db_name> --remote
```

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
