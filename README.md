# 🧑‍🍳 Organiser des séjours

A lightweight web application to organize and manage meal planning during vacation stays. Built with modern, serverless technologies to ensure fast and scalable performance.

🌐 Stack Overview

Frontend: SvelteKit

Hosting: Cloudflare Pages

Backend API: Cloudflare Pages Functions (powered by Workers, written in TypeScript)

Database: Cloudflare D1 (SQLite-based)

Monitoring: Cloudflare Analytics

Authentication: Keycloak (planned)

CI/CD: Git-based deployments with Cloudflare Pages (CI/CD pipeline will come later)

🚀 Getting Started

Prerequisites

Node.js (v18+ recommended)

Wrangler CLI (npm install -g wrangler)

A Cloudflare account

A D1 database created via the Cloudflare Dashboard or wrangler

💠 Project Structure

organisersejour/
├── frontend/               # SvelteKit frontend + Pages Functions
│   ├── src/                # SvelteKit app source
│   ├── functions/          # API routes (Workers)
│   ├── schema.sql          # SQL schema for D1 database
│   ├── wrangler.toml       # Wrangler config for Pages Functions + D1
│   └── ...

🧪 Local Development

1. Install dependencies

```bash
cd frontend
npm install
```

2. Configure Wrangler

Create your wrangler.toml inside the frontend/ folder:

```bash
name = "holiday-meal-planner"
compatibility_date = "2024-04-12"
pages_build_output_dir = ".svelte-kit/cloudflare"

[[d1_databases]]
binding = "DB"
database_name = "your-d1-db-name"
database_id = "your-d1-db-id"
```

💡 Replace your-d1-db-name and your-d1-db-id with actual values from npx wrangler d1 list.

3. Prepare your database

Create a schema.sql file in frontend/ with:

```bash
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT
);

INSERT INTO messages (text) VALUES ('Hello from D1 🎉');
```

Then run:

npx wrangler d1 execute your-d1-db-name --file=schema.sql

4. Start development server

```bash
npx wrangler dev
```

This serves the Svelte app and API (/api/hello) using Pages Functions.

🔍 API Example

The backend exposes an endpoint at:

GET /api/hello

Returns:

{
  "id": 1,
  "text": "Hello from D1 🎉"
}

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

📊 Monitoring

Cloudflare Pages integrates with Cloudflare Analytics by default.

Additional monitoring via Cloudflare Logs and custom logging coming soon.

🔒 Authentication (Planned)

Authentication with Keycloak will be added to protect routes and associate users with meal plans.

📋 Roadmap

🧑‍💻 Contributing

Coming soon!

📄 License

Coming soon!
