# Plan d'implémentation pour la gestion des utilisateurs dans les recettes et ingrédients

Ce document détaille les modifications nécessaires pour que chaque utilisateur ne puisse voir que ses propres ingrédients et recettes, similaire à la façon dont les séjours sont actuellement gérés.

## 1. Modifications de la base de données

### 1.1 Migration pour ajouter user_id à la table ingredients

```sql
-- Migration 0018_add_user_id_to_ingredients.sql
ALTER TABLE ingredients ADD COLUMN user_id TEXT NOT NULL DEFAULT 'dev-user';
CREATE INDEX idx_ingredients_user_id ON ingredients(user_id);
```

### 1.2 Migration pour ajouter user_id à la table recipes

```sql
-- Migration 0019_add_user_id_to_recipes.sql
ALTER TABLE recipes ADD COLUMN user_id TEXT NOT NULL DEFAULT 'dev-user';
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
```

## 2. Modifications des API endpoints

### 2.1 Mise à jour de l'API des ingrédients

#### GET Handler
```typescript
// frontend/src/routes/api/ingredients/+server.ts
export const GET: RequestHandler = async ({ platform, locals }) => {
    const db = platform?.env?.DB;
    
    // Authentification
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated) {
        throw error(401, 'Authentication required');
    }
    
    if (!db) {
        console.error("[API /api/ingredients GET] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        console.log(`[API /api/ingredients GET] Fetching ingredients for user: ${user.id}`);

        // Modifier la requête pour filtrer par user_id
        const stmt = db.prepare('SELECT id, name, unit, type FROM ingredients WHERE user_id = ? ORDER BY type ASC, name ASC');
        const { results } = await stmt.bind(user.id).all<Ingredient>();

        console.log(`[API /api/ingredients GET] Successfully fetched ${results?.length ?? 0} ingredients.`);
        return json({ ingredients: results || [] });
    } catch (e: any) {
        console.error('[API /api/ingredients GET] Error fetching ingredients:', e);
        throw error(500, `Failed to fetch ingredients: ${e.message || 'Unknown error'}`);
    }
};
```

#### POST Handler
```typescript
// Dans la section Database Insertion
const stmt = db.prepare('INSERT INTO ingredients (name, unit, type, user_id) VALUES (?, ?, ?, ?) RETURNING id, name, unit, type, user_id');
const newIngredient = await stmt.bind(name, unit, type, user.id).first<Ingredient>();
```

### 2.2 Mise à jour de l'API des recettes

#### GET Handler
```typescript
// frontend/src/routes/api/recipes/+server.ts
export const GET: RequestHandler = async ({ platform, locals }) => {
    const db = platform?.env?.DB;
    
    // Authentification
    let user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }
    if (!user?.authenticated) {
        throw error(401, 'Authentication required');
    }
    
    if (!db) {
        console.error("[API /api/recipes GET] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        console.log(`[API /api/recipes GET] Fetching recipes for user: ${user.id}`);

        // Modifier la requête pour filtrer par user_id
        const recipesStmt = db.prepare('SELECT * FROM recipes WHERE user_id = ? ORDER BY name ASC');
        const { results: recipesList } = await recipesStmt.bind(user.id).all<Omit<Recipe, 'ingredients' | 'kitchen_tools'>>();

        // Le reste du code reste inchangé...
    } catch (e: any) {
        console.error('[API /api/recipes GET] Error fetching recipes:', e);
        throw error(500, `Failed to fetch recipes: ${e.message || 'Unknown error'}`);
    }
};
```

#### POST Handler
```typescript
// Dans la section Database Insertion
const insertRecipeStmt = db.prepare(`
    INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id
`);

const recipeInsertResult = await insertRecipeStmt.bind(
    body.name.trim(),
    body.description ?? null,
    body.prep_time_minutes ?? null,
    body.cook_time_minutes ?? null,
    body.instructions ?? null,
    body.servings,
    user.id
).first<{ id: number }>();
```

## 3. Modifications des pages serveur

### 3.1 Mise à jour de la page des ingrédients
```typescript
// frontend/src/routes/ingredients/+page.server.ts
export const load: PageServerLoad = async ({ platform, locals }) => {
    const db = platform?.env?.DB;
    const user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';

    // If auth is enabled, ensure user is authenticated
    if (authEnabled && !user?.authenticated) {
        throw error(401, 'Authentication required');
    }
    
    // Pour le développement, utiliser un utilisateur par défaut si l'authentification est désactivée
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }

    if (!db) {
        console.error("[Page /ingredients] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        console.log(`[Page /ingredients] Fetching ingredients for user: ${user.id}`);

        // Modifier la requête pour filtrer par user_id
        const stmt = db.prepare('SELECT id, name, unit, type FROM ingredients WHERE user_id = ? ORDER BY type ASC, name ASC');
        const { results } = await stmt.bind(user.id).all<Ingredient>();

        console.log(`[Page /ingredients] Successfully fetched ${results?.length ?? 0} ingredients.`);
        return { ingredients: results || [] };
    } catch (e: any) {
        console.error('[Page /ingredients] Error fetching ingredients:', e);
        throw error(500, `Failed to fetch ingredients: ${e.message || 'Unknown error'}`);
    }
};
```

### 3.2 Mise à jour de la page des recettes
```typescript
// frontend/src/routes/recipes/+page.server.ts
export const load: PageServerLoad = async ({ platform, locals }) => {
    const db = platform?.env?.DB;
    const user = locals.user;
    const authEnabled = platform?.env?.AUTH_ENABLED === 'true';

    // If auth is enabled, ensure user is authenticated
    if (authEnabled && !user?.authenticated) {
        throw error(401, 'Authentication required');
    }
    
    // Pour le développement, utiliser un utilisateur par défaut si l'authentification est désactivée
    if (!authEnabled && !user) {
        user = { email: 'dev@example.com', id: 'dev-user', name: 'Development User', authenticated: true };
    }

    if (!db) {
        console.error("[Page /recipes] Database binding 'DB' not found.");
        throw error(500, "Database binding not found.");
    }

    try {
        console.log(`[Page /recipes] Fetching recipes for user: ${user.id}`);

        // Modifier la requête pour filtrer par user_id
        const recipesStmt = db.prepare('SELECT * FROM recipes WHERE user_id = ? ORDER BY name ASC');
        const { results: recipesList } = await recipesStmt.bind(user.id).all<Omit<Recipe, 'ingredients' | 'kitchen_tools'>>();

        // Le reste du code reste inchangé...
    } catch (e: any) {
        console.error('[Page /recipes] Error fetching recipes:', e);
        throw error(500, `Failed to fetch recipes: ${e.message || 'Unknown error'}`);
    }
};
```

## 4. Mise à jour des interfaces TypeScript

```typescript
// frontend/src/lib/types.ts
export interface Ingredient {
    id: number;
    name: string;
    unit: string;
    type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre';
    user_id: string;
}

export interface Recipe {
    id: number;
    name: string;
    description: string | null;
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;
    instructions: string | null;
    servings: number;
    user_id: string;
    ingredients: {
        ingredient_id: number;
        name: string;
        unit: string;
        type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre';
        quantity: number;
    }[];
    kitchen_tools: {
        id: number;
        name: string;
    }[];
}
```

## 5. Considérations supplémentaires

### 5.1 Gestion des données existantes
Les migrations ajoutent une valeur par défaut 'dev-user' pour le champ user_id, mais il faudrait idéalement associer les données existantes aux bons utilisateurs. Une approche pourrait être d'ajouter un script d'administration pour permettre aux utilisateurs de réclamer la propriété des recettes/ingrédients existants.

### 5.2 Partage de recettes/ingrédients
Si le partage entre utilisateurs est souhaité à l'avenir, il faudrait implémenter une fonctionnalité spécifique, comme une table de partage ou un champ "public" dans les tables.

### 5.3 Sécurité
Il est crucial de vérifier que toutes les requêtes API vérifient bien l'authentification et filtrent par user_id pour éviter l'accès non autorisé. Chaque endpoint doit valider que l'utilisateur a le droit d'accéder ou de modifier les données demandées.

## 6. Étapes d'implémentation

1. Créer et appliquer les migrations de base de données
2. Mettre à jour les interfaces TypeScript
3. Modifier les API endpoints
4. Mettre à jour les composants serveur des pages
5. Tester l'authentification et l'accès aux données
6. Vérifier que les utilisateurs ne peuvent voir que leurs propres données