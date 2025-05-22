/**
 * Script pour vérifier et importer des recettes dans la base de données
 * Ce script vérifie que tous les ingrédients et ustensiles utilisés dans les recettes
 * existent dans la base de données, et les ajoute si nécessaire avant d'importer les recettes
 */

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RECIPES_FILE = path.join(__dirname, 'sample-data', 'recipes.json');
const INGREDIENTS_FILE = path.join(__dirname, 'sample-data', 'ingredients.json');
const KITCHEN_TOOLS_FILE = path.join(__dirname, 'sample-data', 'kitchen_tools.json');
const TEMP_SQL_FILE = path.join(__dirname, '..', 'import_all.sql');
const USER_ID = 'system'; // ID de l'utilisateur système

// Fonction pour exécuter une commande et récupérer sa sortie
function executeCommand(command) {
  try {
    console.log(`Exécution de la commande: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    return output;
  } catch (error) {
    console.error(`Erreur lors de l'exécution de la commande: ${error.message}`);
    return null;
  }
}

// Fonction pour récupérer les ingrédients et ustensiles de la base de données
function getDatabaseItems() {
  console.log('Récupération des ingrédients et ustensiles de la base de données...');
  
  const output = executeCommand('node db-manager.js --list');
  
  // Extraire les données JSON de la sortie
  const jsonStart = output.indexOf('[');
  const jsonEnd = output.lastIndexOf(']') + 1;
  
  if (jsonStart === -1 || jsonEnd === 0) {
    console.error('Impossible de trouver les données JSON dans la sortie');
    return { ingredients: [], kitchenTools: [] };
  }
  
  const jsonString = output.substring(jsonStart, jsonEnd);
  
  try {
    const data = JSON.parse(jsonString);
    
    // Extraire les ingrédients et les ustensiles
    const ingredients = data[0].results || [];
    const kitchenTools = data[1].results || [];
    
    return { ingredients, kitchenTools };
  } catch (error) {
    console.error(`Erreur lors de l'analyse des données JSON: ${error.message}`);
    return { ingredients: [], kitchenTools: [] };
  }
}

// Fonction pour échapper les apostrophes dans les chaînes SQL
function escapeSql(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
}

// Fonction pour générer le SQL d'ajout des ingrédients manquants
function generateAddIngredientsSQL(missingIngredients) {
  let sql = '';
  
  if (missingIngredients.length === 0) {
    return sql;
  }
  
  sql += '-- Ajout des ingrédients manquants\n';
  
  for (const ingredient of missingIngredients) {
    const name = escapeSql(ingredient.name);
    const unit = escapeSql(ingredient.unit);
    const type = escapeSql(ingredient.type);
    const season = ingredient.season ? `'${escapeSql(ingredient.season)}'` : 'NULL';
    
    sql += `
INSERT INTO ingredients (name, unit, type, season, user_id)
VALUES ('${name}', '${unit}', '${type}', ${season}, '${USER_ID}');
`;
  }
  
  sql += '\n';
  
  return sql;
}

// Fonction pour générer le SQL d'ajout des ustensiles manquants
function generateAddKitchenToolsSQL(missingKitchenTools) {
  let sql = '';
  
  if (missingKitchenTools.length === 0) {
    return sql;
  }
  
  sql += '-- Ajout des ustensiles manquants\n';
  
  for (const tool of missingKitchenTools) {
    const name = escapeSql(tool.name);
    
    sql += `
INSERT INTO kitchen_tools (name, user_id)
VALUES ('${name}', '${USER_ID}');
`;
  }
  
  sql += '\n';
  
  return sql;
}

// Fonction pour générer le SQL d'importation des recettes
function generateImportRecipesSQL(recipes, ingredientMap, toolMap) {
  let sql = '';
  
  // Pour chaque recette
  for (const recipe of recipes) {
    const recipeName = escapeSql(recipe.name);
    const recipeDescription = escapeSql(recipe.description);
    const recipeInstructions = escapeSql(recipe.instructions);
    
    // Vérifier si la recette existe déjà et supprimer ses relations
    sql += `
-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = '${recipeName}' AND user_id = '${USER_ID}'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = '${recipeName}' AND user_id = '${USER_ID}'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = '${recipeName}' AND user_id = '${USER_ID}';

-- Insert recipe: ${recipeName}
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  '${recipeName}',
  '${recipeDescription}',
  ${recipe.prep_time_minutes},
  ${recipe.cook_time_minutes === 0 ? 0 : (recipe.cook_time_minutes || 'NULL')},
  '${recipeInstructions}',
  ${recipe.servings},
  '${recipe.season}',
  '${USER_ID}'
);

-- Store the recipe ID in a variable
WITH new_recipe AS (
  SELECT id FROM recipes WHERE name = '${recipeName}' AND user_id = '${USER_ID}'
)
`;

    // Ajouter les ingrédients à la recette
    for (const ingredient of recipe.ingredients) {
      const ingredientId = ingredient.ingredient_id;
      
      sql += `
-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT id, ${ingredientId}, ${ingredient.quantity}
FROM new_recipe;
`;
    }

    // Ajouter les ustensiles à la recette
    for (const tool of recipe.kitchen_tools) {
      const toolId = tool.id;
      
      sql += `
-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
SELECT id, ${toolId}
FROM new_recipe;
`;
    }

    sql += '\n';
  }
  
  return sql;
}

// Fonction principale
async function main() {
  try {
    // Lire le fichier de recettes
    console.log(`Lecture du fichier de recettes: ${RECIPES_FILE}`);
    const recipesData = JSON.parse(fs.readFileSync(RECIPES_FILE, 'utf8'));
    const recipes = recipesData.recipes;
    
    console.log(`Nombre de recettes trouvées: ${recipes.length}`);
    
    // Récupérer les ingrédients et ustensiles de la base de données
    const { ingredients, kitchenTools } = getDatabaseItems();
    
    console.log(`Nombre d'ingrédients dans la base de données: ${ingredients.length}`);
    console.log(`Nombre d'ustensiles dans la base de données: ${kitchenTools.length}`);
    
    // Créer un ensemble des IDs d'ingrédients et d'ustensiles utilisés dans les recettes
    const usedIngredientIds = new Set();
    const usedToolIds = new Set();
    
    for (const recipe of recipes) {
      for (const ingredient of recipe.ingredients) {
        usedIngredientIds.add(ingredient.ingredient_id);
      }
      
      for (const tool of recipe.kitchen_tools) {
        usedToolIds.add(tool.id);
      }
    }
    
    console.log(`Nombre d'ingrédients utilisés dans les recettes: ${usedIngredientIds.size}`);
    console.log(`Nombre d'ustensiles utilisés dans les recettes: ${usedToolIds.size}`);
    
    // Créer un ensemble des IDs d'ingrédients et d'ustensiles existants dans la base de données
    const existingIngredientIds = new Set(ingredients.map(ingredient => ingredient.id));
    const existingToolIds = new Set(kitchenTools.map(tool => tool.id));
    
    // Identifier les IDs d'ingrédients et d'ustensiles manquants
    const missingIngredientIds = [...usedIngredientIds].filter(id => !existingIngredientIds.has(id));
    const missingToolIds = [...usedToolIds].filter(id => !existingToolIds.has(id));
    
    console.log(`Nombre d'ingrédients manquants: ${missingIngredientIds.length}`);
    console.log(`Nombre d'ustensiles manquants: ${missingToolIds.length}`);
    
    // Si des ingrédients ou des ustensiles sont manquants, les ajouter à la base de données
    if (missingIngredientIds.length > 0 || missingToolIds.length > 0) {
      console.log('Des ingrédients ou des ustensiles sont manquants dans la base de données.');
      console.log('Lecture des fichiers d\'ingrédients et d\'ustensiles...');
      
      // Lire les fichiers d'ingrédients et d'ustensiles
      const ingredientsData = JSON.parse(fs.readFileSync(INGREDIENTS_FILE, 'utf8'));
      const kitchenToolsData = JSON.parse(fs.readFileSync(KITCHEN_TOOLS_FILE, 'utf8'));
      
      // Trouver les ingrédients et ustensiles manquants
      const missingIngredients = ingredientsData.ingredients.filter(ingredient => 
        missingIngredientIds.includes(ingredient.id));
      const missingKitchenTools = kitchenToolsData.kitchen_tools.filter(tool => 
        missingToolIds.includes(tool.id));
      
      console.log(`Nombre d'ingrédients à ajouter: ${missingIngredients.length}`);
      console.log(`Nombre d'ustensiles à ajouter: ${missingKitchenTools.length}`);
      
      // Générer le SQL pour ajouter les ingrédients et ustensiles manquants
      let sql = '';
      
      sql += generateAddIngredientsSQL(missingIngredients);
      sql += generateAddKitchenToolsSQL(missingKitchenTools);
      
      // Générer le SQL pour importer les recettes
      sql += generateImportRecipesSQL(recipes, existingIngredientIds, existingToolIds);
      
      // Écrire le SQL dans un fichier
      fs.writeFileSync(TEMP_SQL_FILE, sql);
      console.log(`SQL d'importation écrit dans le fichier: ${TEMP_SQL_FILE}`);
      
      // Exécuter le SQL
      console.log('Exécution du SQL d\'importation...');
      const output = executeCommand(`wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --file=${TEMP_SQL_FILE}`);
      
      if (output && !output.includes('ERROR')) {
        console.log('Importation réussie!');
      } else {
        console.error('Erreur lors de l\'importation');
      }
    } else {
      console.log('Tous les ingrédients et ustensiles existent déjà dans la base de données.');
      
      // Générer le SQL pour importer les recettes
      const sql = generateImportRecipesSQL(recipes, existingIngredientIds, existingToolIds);
      
      // Écrire le SQL dans un fichier
      fs.writeFileSync(TEMP_SQL_FILE, sql);
      console.log(`SQL d'importation écrit dans le fichier: ${TEMP_SQL_FILE}`);
      
      // Exécuter le SQL
      console.log('Exécution du SQL d\'importation...');
      const output = executeCommand(`wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --file=${TEMP_SQL_FILE}`);
      
      if (output && !output.includes('ERROR')) {
        console.log('Importation réussie!');
      } else {
        console.error('Erreur lors de l\'importation');
      }
    }
    
    // Ne pas supprimer le fichier SQL pour permettre le débogage
    console.log(`Le fichier SQL a été conservé pour le débogage: ${TEMP_SQL_FILE}`);
    
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter la fonction principale
main();