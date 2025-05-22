# Database Manager Script

This script allows you to securely add or delete system items (ingredients, recipes, kitchen tools) in the database without going through the application.

## Prerequisites

- Node.js installed
- Wrangler CLI installed and configured
- Access to the Cloudflare D1 database

## Setup

### Cloudflare Authentication

The script uses Wrangler CLI to interact with your Cloudflare D1 database. Before using the script, you need to authenticate with Cloudflare:

```bash
wrangler login
```

This will:
- Open a browser window to authenticate with your Cloudflare account
- Store your Cloudflare credentials securely on your machine
- Allow Wrangler to access your D1 databases

All database operations performed by the script will use these Cloudflare credentials, ensuring that only authorized users can access your database.

## Usage

The script supports four operations:
- `--add`: Add items to the database
- `--delete`: Delete items from the database
- `--delete-all`: Delete all system items from the database
- `--list`: List items from the database

### Exécution du script

Vous pouvez exécuter le script de deux façons :

1. **Depuis le répertoire racine du projet** :
   ```bash
   node db-manager.js [options]
   # ou
   ./db-manager.js [options]
   ```

2. **Depuis le répertoire des scripts** :
   ```bash
   cd frontend/scripts
   node db-manager.js [options]
   # ou
   ./db-manager.js [options]
   ```

### Command Format

```bash
# For add/delete operations
db-manager.js [--add|--delete] --file <path-to-json> [--env <environment>]

# For list operation
db-manager.js --list [--type <type>] [--format <format>] [--env <environment>]
```

### Parameters

- `--add`, `--delete`, or `--list`: The operation to perform (required)
- `--file`: Path to the JSON file containing the data (required for add/delete operations)
- `--type`: Type of items to list (optional for list operation)
  - Valid values: "ingredients", "recipes", "kitchen_tools", "all" (default)
- `--format`: Output format for list operation (optional)
  - Valid values: "table" (default), "json"
- `--env`: Environment to use (optional, defaults to "development")
  - Valid values: "development", "preview", "production"
- `--help`: Show help information

### Examples

Add ingredients to the development database:
```bash
./db-manager.js --add --file frontend/scripts/sample-data/ingredients.json
```

Add recipes to the production database:
```bash
./db-manager.js --add --file frontend/scripts/sample-data/recipes.json --env production
```

Delete specific items from the preview database:
```bash
./db-manager.js --delete --file frontend/scripts/sample-data/delete_items.json --env preview
```

Delete all system items from the database:
```bash
./db-manager.js --delete-all
```

List all system items:
```bash
./db-manager.js --list
```

List only ingredients:
```bash
./db-manager.js --list --type ingredients
```

List all items in JSON format:
```bash
./db-manager.js --list --format json
```

List recipes in production:
```bash
./db-manager.js --list --type recipes --env production
```

> **Note**: Si vous exécutez le script depuis le répertoire `frontend/scripts`, vous devrez ajuster les chemins des fichiers JSON en conséquence :
> ```bash
> cd frontend/scripts
> ./db-manager.js --add --file sample-data/ingredients.json
> ```

## JSON File Format

### Adding Items

The JSON file should contain one or more of the following sections:

#### Ingredients

```json
{
  "ingredients": [
    {
      "name": "Tomate",
      "unit": "pcs",
      "type": "légume",
      "season": "summer"
    }
  ]
}
```

Valid types: "boisson", "pain", "condiment", "légume", "fruit", "viande", "poisson", "autre"
Valid seasons: "spring", "summer", "autumn", "winter", null

#### Kitchen Tools

```json
{
  "kitchen_tools": [
    {
      "name": "Saladier"
    }
  ]
}
```

#### Recipes

```json
{
  "recipes": [
    {
      "name": "Salade de Tomates",
      "description": "Une salade de tomates fraîches",
      "prep_time_minutes": 10,
      "cook_time_minutes": 0,
      "instructions": "1. Laver et couper les tomates...",
      "servings": 4,
      "season": "summer",
      "ingredients": [
        {
          "ingredient_id": 1,
          "quantity": 4
        }
      ],
      "kitchen_tools": [
        {
          "id": 1
        }
      ]
    }
  ]
}
```

### Deleting Items

For deletion, you only need to provide the name or ID of the items:

```json
{
  "ingredients": [
    {
      "name": "Tomate"
    }
  ],
  "recipes": [
    {
      "name": "Salade de Tomates"
    }
  ],
  "kitchen_tools": [
    {
      "name": "Saladier"
    }
  ]
}
```

## Security Considerations

- Only run this script in a trusted environment
- The script will only allow deletion of system items (user_id = 'system')
- The script validates the data before executing any database operations
- Access to the database is controlled by Cloudflare authentication
- Only users with proper permissions on your Cloudflare account can access the database

## Authentication Process

- **Wrangler Login**: When you run `wrangler login`, you authenticate with your Cloudflare account
- **Credential Storage**: Wrangler stores your Cloudflare credentials securely on your machine
- **Database Access**: When the script executes Wrangler commands, it uses these credentials to access your D1 database
- **Authorization**: Only users with proper permissions on your Cloudflare account can access the database

## Troubleshooting

If you encounter errors:

1. Check that your JSON file is properly formatted
2. Verify that you have the correct permissions to access the database
3. Ensure that Wrangler is properly configured
4. Check the SQL file generated in case of errors (it's kept for debugging purposes)