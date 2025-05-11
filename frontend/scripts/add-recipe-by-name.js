/**
 * Script pour ajouter une recette en spécifiant les noms des ingrédients et ustensiles
 * Ce script vérifie si les ingrédients et ustensiles existent déjà dans la base de données
 * et les ajoute si nécessaire avant d'ajouter la recette
 */

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const TEMP_SQL_FILE = path.join(__dirname, '..', 'add_recipe_by_name.sql');
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
  
  if (!output) {
    console.error('Aucune sortie de la commande db-manager.js --list');
    return { ingredients: [], kitchenTools: [] };
  }
  
  // Rechercher un tableau JSON dans la sortie
  const jsonRegex = /\[\s*\{.*\}\s*\]/s;
  const match = output.match(jsonRegex);
  
  if (!match) {
    console.error('Impossible de trouver un tableau JSON dans la sortie');
    
    // Essayer une autre approche : chercher le début et la fin du JSON
    const jsonStart = output.indexOf('[');
    const jsonEnd = output.lastIndexOf(']') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error('Impossible de trouver les délimiteurs JSON dans la sortie');
      return { ingredients: [], kitchenTools: [] };
    }
    
    const jsonString = output.substring(jsonStart, jsonEnd);
    
    try {
      const data = JSON.parse(jsonString);
      
      // Extraire les ingrédients et les ustensiles
      const ingredients = data[0]?.results || [];
      const kitchenTools = data[1]?.results || [];
      
      return { ingredients, kitchenTools };
    } catch (error) {
      console.error(`Erreur lors de l'analyse des données JSON: ${error.message}`);
      
      // Afficher un extrait du JSON pour le débogage
      console.error(`Extrait du JSON: ${jsonString.substring(0, 100)}...`);
      
      // Essayer de récupérer les données directement depuis la base de données
      console.log('Tentative de récupération directe des ingrédients et ustensiles...');
      
      // Récupérer les ingrédients
      const ingredientsOutput = executeCommand('wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --command="SELECT id, name FROM ingredients"');
      
      // Récupérer les ustensiles
      const toolsOutput = executeCommand('wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --command="SELECT id, name FROM kitchen_tools"');
      
      // Analyser les résultats
      const ingredients = parseDbOutput(ingredientsOutput);
      const kitchenTools = parseDbOutput(toolsOutput);
      
      return { ingredients, kitchenTools };
    }
  }
  
  try {
    const jsonString = match[0];
    const data = JSON.parse(jsonString);
    
    // Extraire les ingrédients et les ustensiles
    const ingredients = data[0]?.results || [];
    const kitchenTools = data[1]?.results || [];
    
    return { ingredients, kitchenTools };
  } catch (error) {
    console.error(`Erreur lors de l'analyse des données JSON: ${error.message}`);
    return { ingredients: [], kitchenTools: [] };
  }
}

// Fonction pour analyser la sortie de la base de données
function parseDbOutput(output) {
  if (!output) return [];
  
  // Rechercher un tableau JSON dans la sortie
  const jsonRegex = /\[\s*\{.*\}\s*\]/s;
  const match = output.match(jsonRegex);
  
  if (!match) {
    console.error('Impossible de trouver un tableau JSON dans la sortie');
    return [];
  }
  
  try {
    const jsonString = match[0];
    return JSON.parse(jsonString);
  } catch (error) {
    console.error(`Erreur lors de l'analyse des données JSON: ${error.message}`);
    return [];
  }
}

// Fonction pour échapper les apostrophes dans les chaînes SQL
function escapeSql(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
}

// Fonction pour créer une interface de ligne de commande interactive
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Fonction pour poser une question à l'utilisateur
function askQuestion(rl, question) {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
}

// Fonction pour vérifier si un ingrédient existe dans la base de données
function findIngredientByName(ingredients, name) {
  // Normaliser le nom (supprimer les espaces supplémentaires, mettre en minuscules)
  const normalizedName = name.toLowerCase().trim();
  
  // Rechercher l'ingrédient
  const foundIngredient = ingredients.find(ingredient => {
    const ingredientName = ingredient.name.toLowerCase().trim();
    return ingredientName === normalizedName;
  });
  
  if (foundIngredient) {
    console.log(`Ingrédient trouvé dans la base de données: ${name} (ID: ${foundIngredient.id})`);
  }
  
  return foundIngredient;
}

// Fonction pour vérifier si un ustensile existe dans la base de données
function findKitchenToolByName(kitchenTools, name) {
  // Normaliser le nom (supprimer les espaces supplémentaires, mettre en minuscules)
  const normalizedName = name.toLowerCase().trim();
  
  // Rechercher l'ustensile
  const foundTool = kitchenTools.find(tool => {
    const toolName = tool.name.toLowerCase().trim();
    return toolName === normalizedName;
  });
  
  if (foundTool) {
    console.log(`Ustensile trouvé dans la base de données: ${name} (ID: ${foundTool.id})`);
  }
  
  return foundTool;
}

// Fonction pour générer le SQL d'ajout d'un ingrédient
function generateAddIngredientSQL(name, unit, type, season) {
  const seasonValue = season === 'null' ? 'NULL' : `'${escapeSql(season)}'`;
  
  return `
INSERT INTO ingredients (name, unit, type, season, user_id)
VALUES ('${escapeSql(name)}', '${escapeSql(unit)}', '${escapeSql(type)}', ${seasonValue}, '${USER_ID}');
`;
}

// Fonction pour générer le SQL d'ajout d'un ustensile
function generateAddKitchenToolSQL(name) {
  return `
INSERT INTO kitchen_tools (name, user_id)
VALUES ('${escapeSql(name)}', '${USER_ID}');
`;
}

// Fonction pour générer le SQL d'ajout d'une recette
function generateAddRecipeSQL(recipe, ingredientMap, toolMap) {
  const recipeName = escapeSql(recipe.name);
  const recipeDescription = escapeSql(recipe.description);
  const recipeInstructions = escapeSql(recipe.instructions);
  
  let sql = `
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
    const ingredientId = ingredientMap[ingredient.name.toLowerCase()];
    
    sql += `
-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
SELECT id, ${ingredientId}, ${ingredient.quantity}
FROM new_recipe;
`;
  }

  // Ajouter les ustensiles à la recette
  for (const tool of recipe.kitchen_tools) {
    const toolId = toolMap[tool.name.toLowerCase()];
    
    sql += `
-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
SELECT id, ${toolId}
FROM new_recipe;
`;
  }

  return sql;
}

// Fonction principale
async function main() {
  try {
    // Créer une interface de ligne de commande interactive
    const rl = createInterface();
    
    // Demander le chemin du fichier de recette
    const recipePath = await askQuestion(rl, 'Chemin du fichier de recette: ');
    
    // Lire le fichier de recette
    console.log(`Lecture du fichier de recette: ${recipePath}`);
    const recipeData = JSON.parse(fs.readFileSync(recipePath, 'utf8'));
    
    // Récupérer les ingrédients et ustensiles de la base de données
    const { ingredients, kitchenTools } = getDatabaseItems();
    
    console.log(`Nombre d'ingrédients dans la base de données: ${ingredients.length}`);
    console.log(`Nombre d'ustensiles dans la base de données: ${kitchenTools.length}`);
    
    // Vérifier si les ingrédients et ustensiles existent dans la base de données
    const missingIngredients = [];
    const missingKitchenTools = [];
    
    for (const ingredient of recipeData.ingredients) {
      const existingIngredient = findIngredientByName(ingredients, ingredient.name);
      
      if (!existingIngredient) {
        missingIngredients.push(ingredient);
      }
    }
    
    for (const tool of recipeData.kitchen_tools) {
      const existingTool = findKitchenToolByName(kitchenTools, tool.name);
      
      if (!existingTool) {
        missingKitchenTools.push(tool.name);
      }
    }
    
    console.log(`Nombre d'ingrédients manquants: ${missingIngredients.length}`);
    console.log(`Nombre d'ustensiles manquants: ${missingKitchenTools.length}`);
    
    // Générer le SQL pour ajouter les ingrédients et ustensiles manquants
    let sql = '';
    
    // Ajouter les ingrédients manquants
    if (missingIngredients.length > 0) {
      sql += '-- Ajout des ingrédients manquants\n';
      
      for (const ingredient of missingIngredients) {
        console.log(`\nIngrédient manquant: ${ingredient.name}`);
        
        // Utiliser les informations fournies dans le fichier de recette
        let unit = ingredient.unit;
        let type = ingredient.type;
        let season = ingredient.season;
        
        // Si les informations ne sont pas fournies, les demander à l'utilisateur
        if (!unit) {
          unit = await askQuestion(rl, 'Unité (g, ml, pcs): ');
        }
        
        if (!type) {
          type = await askQuestion(rl, 'Type (légume, fruit, viande, poisson, condiment, autre): ');
        }
        
        if (season === undefined) {
          season = await askQuestion(rl, 'Saison (spring, summer, autumn, winter, null): ');
        }
        
        sql += generateAddIngredientSQL(ingredient.name, unit, type, season);
      }
      
      sql += '\n';
    }
    
    // Ajouter les ustensiles manquants
    if (missingKitchenTools.length > 0) {
      sql += '-- Ajout des ustensiles manquants\n';
      
      for (const toolName of missingKitchenTools) {
        console.log(`\nUstensile manquant: ${toolName}`);
        
        sql += generateAddKitchenToolSQL(toolName);
      }
      
      sql += '\n';
    }
    
    // Exécuter le SQL pour ajouter les ingrédients et ustensiles manquants
    if (sql !== '') {
      fs.writeFileSync(TEMP_SQL_FILE, sql);
      console.log(`SQL d'ajout des ingrédients et ustensiles écrit dans le fichier: ${TEMP_SQL_FILE}`);
      
      console.log('Exécution du SQL d\'ajout des ingrédients et ustensiles...');
      const output = executeCommand(`wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --file=${TEMP_SQL_FILE}`);
      
      if (output && !output.includes('ERROR')) {
        console.log('Ajout des ingrédients et ustensiles réussi!');
      } else {
        console.error('Erreur lors de l\'ajout des ingrédients et ustensiles');
        rl.close();
        return;
      }
    }
    
    // Récupérer à nouveau les ingrédients et ustensiles de la base de données
    const { ingredients: updatedIngredients, kitchenTools: updatedKitchenTools } = getDatabaseItems();
    
    // Créer un mapping des noms d'ingrédients vers leurs IDs
    const ingredientMap = {};
    updatedIngredients.forEach(ingredient => {
      ingredientMap[ingredient.name.toLowerCase()] = ingredient.id;
    });
    
    // Créer un mapping des noms d'ustensiles vers leurs IDs
    const toolMap = {};
    updatedKitchenTools.forEach(tool => {
      toolMap[tool.name.toLowerCase()] = tool.id;
    });
    
    // Générer le SQL pour ajouter la recette
    sql = generateAddRecipeSQL(recipeData, ingredientMap, toolMap);
    
    // Écrire le SQL dans un fichier
    fs.writeFileSync(TEMP_SQL_FILE, sql);
    console.log(`SQL d'ajout de la recette écrit dans le fichier: ${TEMP_SQL_FILE}`);
    
    // Exécuter le SQL
    console.log('Exécution du SQL d\'ajout de la recette...');
    const output = executeCommand(`wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --file=${TEMP_SQL_FILE}`);
    
    if (output && !output.includes('ERROR')) {
      console.log('Ajout de la recette réussi!');
    } else {
      console.error('Erreur lors de l\'ajout de la recette');
    }
    
    // Fermer l'interface de ligne de commande
    rl.close();
    
    // Ne pas supprimer le fichier SQL pour permettre le débogage
    console.log(`Le fichier SQL a été conservé pour le débogage: ${TEMP_SQL_FILE}`);
    
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter la fonction principale
main();