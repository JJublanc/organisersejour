# Meal Planning Feature - Implementation Plan

This document outlines the steps to implement the meal planning and shopping list feature for the trip management application.

## 1. Proposed Database Schema

```mermaid
erDiagram
    TRIPS ||--o{ TRIP_DAYS : "has"
    TRIP_DAYS ||--o{ MEALS : "has"
    MEALS ||--o{ MEAL_RECIPES : "contains"
    MEAL_RECIPES }|--|| RECIPES : "references"
    RECIPES ||--o{ RECIPE_INGREDIENTS : "uses"
    RECIPE_INGREDIENTS }|--|| INGREDIENTS : "references"
    RECIPES ||--o{ RECIPE_KITCHEN_TOOLS : "requires"
    RECIPE_KITCHEN_TOOLS }|--|| KITCHEN_TOOLS : "references"

    TRIPS {
        INTEGER id PK
        TEXT name
        TEXT start_date
        TEXT end_date
        TEXT location
        TEXT organiser_id
        INTEGER num_people "Number of people"
    }
    TRIP_DAYS {
        INTEGER id PK
        INTEGER trip_id FK "Refers to TRIPS"
        TEXT date "YYYY-MM-DD"
    }
    MEALS {
        INTEGER id PK
        INTEGER trip_day_id FK "Refers to TRIP_DAYS"
        TEXT type "'breakfast', 'lunch', 'dinner'"
        TEXT drinks "Optional description"
        BOOLEAN bread "Is bread included?"
    }
    MEAL_RECIPES {
        INTEGER meal_id FK "Refers to MEALS"
        INTEGER recipe_id FK "Refers to RECIPES"
        PK (meal_id, recipe_id)
    }
    RECIPES {
        INTEGER id PK
        TEXT name
        TEXT description "Optional"
        INTEGER prep_time_minutes
        INTEGER cook_time_minutes
        TEXT instructions
        INTEGER servings "Base number recipe serves"
    }
    RECIPE_INGREDIENTS {
        INTEGER recipe_id FK "Refers to RECIPES"
        INTEGER ingredient_id FK "Refers to INGREDIENTS"
        REAL quantity
        PK (recipe_id, ingredient_id)
    }
    INGREDIENTS {
        INTEGER id PK
        TEXT name UK
        TEXT unit "'g', 'kg', 'ml', 'l', 'pcs', etc."
    }
    RECIPE_KITCHEN_TOOLS {
        INTEGER recipe_id FK "Refers to RECIPES"
        INTEGER tool_id FK "Refers to KITCHEN_TOOLS"
        PK (recipe_id, tool_id)
    }
    KITCHEN_TOOLS {
        INTEGER id PK
        TEXT name UK
    }
```

## 2. Proposed User Flow

1.  **View Trips:** User sees their list of trips (existing).
2.  **Select Trip:** User opens a trip's details page.
3.  **Access Meal Planner:** A new "Meal Planner" tab/section appears on the trip details page.
4.  **Meal Planner View:** Shows days, meal slots (Breakfast, Lunch, Dinner), assigned recipes/drinks/bread, and "Edit" buttons.
5.  **Edit Meal:** Modal/form to search/select recipes, add drinks, toggle bread. Saves changes.
6.  **Generate Shopping List:** Button available on Meal Planner or Trip Details.
7.  **Shopping List View:** Displays aggregated, scaled ingredients.

## 3. Detailed Development Task Breakdown

**Phase 1: Foundational Backend (Database & Core Data)**

1.  **Database Migrations:**
    *   Create `frontend/migrations/0005_create_ingredients_table.sql` (`ingredients`).
    *   Create `frontend/migrations/0006_create_kitchen_tools_table.sql` (`kitchen_tools`).
    *   Create `frontend/migrations/0007_create_recipes_table.sql` (`recipes`).
    *   Create `frontend/migrations/0008_create_recipe_ingredients_table.sql` (`recipe_ingredients`).
    *   Create `frontend/migrations/0009_create_recipe_kitchen_tools_table.sql` (`recipe_kitchen_tools`).
    *   Create `frontend/migrations/0010_create_trip_days_table.sql` (`trip_days`).
    *   Create `frontend/migrations/0011_create_meals_table.sql` (`meals`).
    *   Create `frontend/migrations/0012_create_meal_recipes_table.sql` (`meal_recipes`).
    *   *Action:* Apply migrations (`npx wrangler d1 migrations apply DB --local`).

2.  **Seed Data (Recommended):**
    *   Create script/SQL to populate `ingredients`, `kitchen_tools`, sample `recipes` and links.

3.  **Core Data API Endpoints:**
    *   `frontend/src/routes/api/recipes/+server.ts`: `GET` all recipes (with ingredients/tools).
    *   `frontend/src/routes/api/ingredients/+server.ts`: `GET` all ingredients.
    *   `frontend/src/routes/api/kitchen_tools/+server.ts`: `GET` all kitchen tools.

**Phase 2: Trip Detail & Meal Planning Backend**

1.  **Trip Detail Page Route (`frontend/src/routes/trips/[tripId]/+page.server.ts`):**
    *   `load`: Fetch single trip details, associated `trip_days`, `meals`, and linked `recipes`. Handle auth.

2.  **Meal Management API Endpoint (`frontend/src/routes/api/meals/[mealId]/+server.ts`):**
    *   `PUT`: Update meal (recipes, drinks, bread). Verify ownership, update `meals`, clear/re-insert `meal_recipes`. Handle auth.

3.  **Trip Day Generation Logic (in `frontend/src/routes/trips/+page.server.ts` `createTrip` action):**
    *   After trip insert, calculate dates.
    *   Insert records into `trip_days`.
    *   Insert default `meals` (breakfast, lunch, dinner) for each `trip_day`.

**Phase 3: Frontend Implementation**

1.  **Update Trips List Page (`frontend/src/routes/trips/+page.svelte`):**
    *   Add link: `<a href="/trips/{trip.id}" class="details-link">Plan Meals / View Details</a>`.

2.  **Trip Detail Page Component (`frontend/src/routes/trips/[tripId]/+page.svelte`):**
    *   Display trip details.
    *   Include "Meal Planner" section.

3.  **Meal Planner Component (`frontend/src/lib/components/MealPlanner.svelte`):**
    *   Props: Meal data (days -> meals -> recipes).
    *   Display days, meals, recipes, drinks, bread.
    *   "Edit" button per meal slot.

4.  **Meal Edit Modal Component (`frontend/src/lib/components/MealEditModal.svelte`):**
    *   Props: `showModal`, `mealData`.
    *   Fetch/receive available recipes.
    *   UI: Recipe multi-select, drinks input, bread checkbox.
    *   "Save" button: `PUT` to `/api/meals/[mealId]`.
    *   Events: `close`, `mealUpdated` (triggers data refresh).

**Phase 4: Shopping List Feature**

1.  **Shopping List API Endpoint (`frontend/src/routes/api/trips/[tripId]/shopping-list/+server.ts`):**
    *   `GET`: Generate shopping list.
    *   Verify ownership. Fetch `trip.num_people`.
    *   Fetch all meals/recipes for the trip.
    *   For each recipe: Fetch servings, ingredients. Calculate scaling factor (`trip.num_people / recipe.servings`). Calculate required ingredient quantities.
    *   Aggregate quantities for identical ingredients.
    *   Return list: { ingredient_name, total_quantity, unit }. Handle auth.

2.  **Shopping List Display Component (`frontend/src/lib/components/ShoppingListDisplay.svelte` or integrated):**
    *   Button "Generate Shopping List" on Trip Detail page.
    *   On click: Fetch from `/api/trips/[tripId]/shopping-list`.
    *   Display aggregated list.


**Phase 5: Refinement & Testing**

1.  **Error Handling:** Frontend and backend.
2.  **Loading States:** UI indicators.
3.  **UI/UX Polish:** Appearance and usability.
4.  **Testing:** Backend logic (shopping list), API endpoints, frontend components/flows.

Backlog
- ajouter la possibilité de créer une recette -> OK
- ajouter la possibilité de créer un ingrédient -> OK
- ajouter la possibilité de créer un unstensile de cuisine -> OK
- ajouter la possibilité d'ajouter plusieurs recettes pour un repas -> OK
- les recettes doivent contenir le type entrée / plat / dessert / autre -> OK
- les ingrédients rattachés directement au repas doivent s'enregistrer + ils doivent avoir une quantité et une unité par personne -> OK
- ajouter une section boissons et pain dans les repas -> OK
- Ajouter un type pour les ingrédients : boisson / pain / condiment / légume / fruit / viande / poisson / autre --> OK
- l'utilisateur doit pouvoir consulter ses recettes et ses ingrédients -> OK
- Ajouter un utilisateur pour les recettes et les ingrédients et n'afficher que les recettes et ingrédients --> OK = vérifié en changeant l'utilisateur de dev

- permettre la suppression d'ingrédients, de repas, de séjour etc. -> OK
- On doit pouvoir avoir un tag sur la saison pour les repas
- Pré-remplir la base de données avec des ingrédients, des recettes pour tous les utilisateurs (ils ne peuvent pas être supprimé, mais peuvent ne plus être affichés pour l'utilisateur)

- Lancer un test automatique des fonctionnalités de l'application (Selenium ?)

- Amélioration du design
--- Page d'accueil qui indique en quelques mots ce que fait l'application


--------------------------------------------------------------------------------------------

- Il faut gérer les noms des recettes et nouveaux ingrédients pour interdire la création de doublons --> OK mais changer le message pour aider l'utilisateur

- Conception du multi tenant : comment partager les recettes et les ingrédients

- Ajouter la possibilité de visualiser son matériel
- Ajouter des photos aux séjours et recettes
- Télécharger la liste au format PDF

- Filtrer : pour choisir une recette l'utilisateur doit pouvoir filtrer en fonction du type de cette (entrée / plat / dessert / autre), des instruments de cuisine nécessaires, de la saison de la recette (printemps / été / automne / hiver / toutes saisons)

- changer les listes en recherche intelligentes

- Features avancées : génération / duplication de recettes, génération de commande sur Carrefour ou autre, création de l'application mobile