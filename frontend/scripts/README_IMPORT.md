# Scripts d'importation de recettes

Ce dossier contient plusieurs scripts pour vous aider à importer des recettes dans la base de données, en vérifiant et en ajoutant les ingrédients et ustensiles manquants.

## Prérequis

- Node.js (version 14 ou supérieure)
- Les fichiers de recettes, ingrédients et ustensiles dans le dossier `sample-data`

## Scripts disponibles

### 1. Ajout de recettes par nom d'ingrédients et d'ustensiles

#### a. Ajout d'une recette individuelle

Le script `add-recipe-by-name-v2.js` vous permet d'ajouter une recette en spécifiant les noms des ingrédients et ustensiles, plutôt que leurs IDs. Si un ingrédient ou un ustensile n'existe pas dans la base de données, le script vous demandera les informations nécessaires pour l'ajouter.

```bash
node add-recipe-by-name-v2.js
```

Ce script vous demandera le chemin du fichier JSON contenant la recette à ajouter. Un exemple de fichier est disponible dans `sample-data/recipe-template.json`. Le script peut traiter soit un fichier contenant une seule recette, soit un fichier contenant un tableau de recettes (dans ce cas, il vous demandera quelle recette traiter).

> **Note**: Cette version améliorée du script est plus robuste pour détecter les ingrédients et ustensiles existants et éviter les erreurs de contrainte d'unicité. Elle utilise également la clause SQL `INSERT OR IGNORE` pour éviter les erreurs lors de l'ajout d'ingrédients ou d'ustensiles qui existent déjà.

#### b. Ajout automatique de toutes les recettes d'un fichier

Le script `add-all-recipes-by-name.js` vous permet d'ajouter automatiquement toutes les recettes contenues dans un fichier JSON, sans avoir à les traiter une par une.

```bash
node add-all-recipes-by-name.js
```

Ce script vous demandera le chemin du fichier JSON contenant les recettes à ajouter. Le fichier doit contenir un tableau de recettes, comme dans `sample-data/recipe.json`. Le script collectera d'abord tous les ingrédients et ustensiles manquants de toutes les recettes, puis les ajoutera à la base de données avant d'ajouter les recettes elles-mêmes.

> **Note**: Ce script est particulièrement utile pour importer un grand nombre de recettes en une seule opération.

### 2. Vérification des ingrédients et ustensiles

Le script `check-recipe-ingredients.js` vérifie si tous les ingrédients et ustensiles utilisés dans les recettes existent dans la base de données.

```bash
node check-recipe-ingredients.js
```

Ce script affiche les IDs des ingrédients et ustensiles manquants dans la base de données.

### 3. Ajout interactif des ingrédients et ustensiles manquants

Le script `add-missing-ingredients.js` vous permet d'ajouter interactivement les ingrédients et ustensiles manquants à la base de données.

```bash
node add-missing-ingredients.js
```

Ce script vous demandera de fournir les informations nécessaires pour chaque ingrédient et ustensile manquant, puis générera un script SQL pour les ajouter à la base de données.

### 4. Vérification et importation des recettes

Le script `check-and-import-recipes.js` vérifie les ingrédients et ustensiles manquants, puis génère un script SQL pour les ajouter à la base de données avant d'importer les recettes.

```bash
node check-and-import-recipes.js
```

### 5. Comptage et visualisation des recettes

Le script `count-recipes.js` vous permet de compter le nombre de recettes dans la base de données, de visualiser la liste des recettes par saison, et d'afficher les détails d'une recette spécifique.

```bash
node count-recipes.js
```

Ce script vous offre plusieurs options :
- Filtrer les recettes par user_id (par exemple, pour voir uniquement les recettes "system")
- Afficher la liste complète des recettes, organisées par saison
- Consulter les détails d'une recette spécifique, y compris ses ingrédients et ustensiles

## Processus recommandé

Pour ajouter une recette en spécifiant les noms des ingrédients et ustensiles :

1. Créez un fichier JSON basé sur le modèle `sample-data/recipe-template.json`.
2. Exécutez `add-recipe-by-name.js` et fournissez le chemin de votre fichier JSON.
3. Le script vérifiera si les ingrédients et ustensiles existent déjà dans la base de données et vous demandera des informations supplémentaires pour ceux qui n'existent pas.
4. La recette sera ajoutée à la base de données avec les ingrédients et ustensiles correspondants.

## Format des fichiers de données

### Recette avec noms (recipe-template.json)

```json
{
  "name": "Salade Caprese",
  "description": "Une salade italienne fraîche avec tomates, mozzarella et basilic.",
  "prep_time_minutes": 10,
  "cook_time_minutes": 0,
  "instructions": "1. Couper les tomates et la mozzarella en tranches.\n2. Disposer en alternance sur une assiette.\n3. Ajouter le basilic, l'huile d'olive, le sel et le poivre.\n4. Servir frais.",
  "servings": 2,
  "season": "summer",
  "ingredients": [
    {
      "name": "Tomate",
      "quantity": 2,
      "unit": "pcs",
      "type": "légume",
      "season": "summer"
    },
    {
      "name": "Mozzarella",
      "quantity": 125,
      "unit": "g",
      "type": "autre",
      "season": "null"
    }
  ],
  "kitchen_tools": [
    {
      "name": "Couteau de chef"
    },
    {
      "name": "Planche à découper"
    }
  ]
}
```

Les champs `unit`, `type` et `season` pour chaque ingrédient sont optionnels. Si vous les fournissez, ils seront utilisés pour ajouter l'ingrédient à la base de données s'il n'existe pas déjà. Si vous ne les fournissez pas, le script vous les demandera interactivement.

### Recettes avec IDs (recipes.json)

```json
{
  "recipes": [
    {
      "name": "Nom de la recette",
      "description": "Description de la recette",
      "prep_time_minutes": 20,
      "cook_time_minutes": 40,
      "instructions": "Instructions de la recette",
      "servings": 6,
      "season": "autumn",
      "ingredients": [
        { "ingredient_id": 34, "quantity": 2 },
        { "ingredient_id": 244, "quantity": 30 }
      ],
      "kitchen_tools": [
        { "id": 87 },
        { "id": 88 }
      ]
    }
  ]
}
```

### Ingrédients (ingredients.json)

```json
{
  "ingredients": [
    {
      "name": "Tomate",
      "unit": "g",
      "type": "légume",
      "season": "summer"
    }
  ]
}
```

### Ustensiles (kitchen_tools.json)

```json
{
  "kitchen_tools": [
    { "name": "Saladier" },
    { "name": "Couteau de chef" }
  ]
}
```

## Remarques

- Les scripts utilisent l'ID utilisateur "system" pour ajouter les ingrédients, ustensiles et recettes à la base de données.
- Les fichiers SQL générés sont conservés pour le débogage et peuvent être exécutés manuellement si nécessaire.
- Si vous rencontrez des erreurs lors de l'exécution des scripts, vérifiez les messages d'erreur pour plus d'informations.