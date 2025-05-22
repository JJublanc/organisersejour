/**
 * Script pour ajouter toutes les recettes d'un fichier JSON en spécifiant les noms des ingrédients et ustensiles
 * Ce script vérifie si les ingrédients et ustensiles existent déjà dans la base de données
 * et les ajoute si nécessaire avant d'ajouter les recettes
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
  
  // Récupérer les ingrédients directement avec une requête SQL
  const ingredientsOutput = executeCommand('wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --command="SELECT id, name, unit, type, season FROM ingredients"');
  
  // Récupérer les ustensiles directement avec une requête SQL
  const toolsOutput = executeCommand('wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --command="SELECT id, name FROM kitchen_tools"');
  
  // Analyser les résultats
  const ingredients = parseDbOutput(ingredientsOutput) || [];
  const kitchenTools = parseDbOutput(toolsOutput) || [];
  
  return { ingredients, kitchenTools };
}

// Fonction pour analyser la sortie de la base de données
function parseDbOutput(output) {
  if (!output) return [];
  
  try {
    // Afficher un extrait de la sortie pour le débogage
    console.log('Extrait de la sortie:');
    console.log(output.substring(0, 200) + '...');
    
    // Rechercher un tableau JSON dans la sortie
    const jsonRegex = /\[\s*\{.*\}\s*\]/s;
    const match = output.match(jsonRegex);
    
    if (!match) {
      console.error('Impossible de trouver un tableau JSON dans la sortie');
      
      // Essayer une autre approche : chercher le début et la fin du JSON
      const jsonStart = output.indexOf('[');
      const jsonEnd = output.lastIndexOf(']') + 1;
      
      if (jsonStart === -1 || jsonEnd <= jsonStart) {
        console.error('Impossible de trouver les délimiteurs JSON dans la sortie');
        return [];
      }
      
      const jsonString = output.substring(jsonStart, jsonEnd);
      console.log('JSON extrait:');
      console.log(jsonString.substring(0, 200) + '...');
      
      try {
        return JSON.parse(jsonString);
      } catch (innerError) {
        console.error(`Erreur lors de l'analyse du JSON extrait: ${innerError.message}`);
        return [];
      }
    }
    
    const jsonString = match[0];
    console.log('JSON trouvé:');
    console.log(jsonString.substring(0, 200) + '...');
    
    const data = JSON.parse(jsonString);
    
    // Vérifier si les données sont dans un format attendu
    if (Array.isArray(data) && data.length > 0) {
      // Si les données sont un tableau d'objets avec une propriété 'results'
      if (data[0] && data[0].results) {
        return data[0].results;
      }
      // Sinon, retourner le tableau directement
      return data;
    }
    
    return [];
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

// Fonction pour normaliser un nom (supprimer les espaces, mettre en minuscules)
function normalizeName(name) {
  return name.toLowerCase().trim();
}

// Fonction pour vérifier si un ingrédient existe dans la base de données
function findIngredientByName(ingredients, name) {
  // Normaliser le nom
  const normalizedName = normalizeName(name);
  
  // Rechercher l'ingrédient
  const foundIngredient = ingredients.find(ingredient => {
    const ingredientName = normalizeName(ingredient.name);
    return ingredientName === normalizedName;
  });
  
  if (foundIngredient) {
    console.log(`Ingrédient trouvé dans la base de données: ${name} (ID: ${foundIngredient.id})`);
  }
  
  return foundIngredient;
}

// Fonction pour vérifier si un ustensile existe dans la base de données
function findKitchenToolByName(kitchenTools, name) {
  // Normaliser le nom
  const normalizedName = normalizeName(name);
  
  // Rechercher l'ustensile
  const foundTool = kitchenTools.find(tool => {
    const toolName = normalizeName(tool.name);
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
-- Vérifier si l'ingrédient existe déjà
INSERT OR IGNORE INTO ingredients (name, unit, type, season, user_id)
VALUES ('${escapeSql(name)}', '${escapeSql(unit)}', '${escapeSql(type)}', ${seasonValue}, '${USER_ID}');
`;
}

// Fonction pour générer le SQL d'ajout d'un ustensile
function generateAddKitchenToolSQL(name) {
  return `
-- Vérifier si l'ustensile existe déjà
INSERT OR IGNORE INTO kitchen_tools (name)
VALUES ('${escapeSql(name)}');
`;
}

// Fonction pour générer le SQL d'ajout d'une recette
function generateAddRecipeSQL(recipe, ingredientMap, toolMap) {
  const recipeName = escapeSql(recipe.name);
  const recipeDescription = escapeSql(recipe.description);
  const recipeInstructions = escapeSql(recipe.instructions);
  
  let sql = `
-- Check if recipe already exists and delete its relationships
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM recipes WHERE name = '${recipeName}' AND user_id = '${USER_ID}');

DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM recipes WHERE name = '${recipeName}' AND user_id = '${USER_ID}');

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

-- Get the ID of the newly inserted recipe
SELECT last_insert_rowid() AS recipe_id;
`;

  // Ajouter les ingrédients à la recette
  for (const ingredient of recipe.ingredients) {
    const normalizedName = normalizeName(ingredient.name);
    const ingredientId = ingredientMap[normalizedName];
    
    if (!ingredientId) {
      console.error(`Erreur: ID de l'ingrédient '${ingredient.name}' non trouvé dans le mapping`);
      continue;
    }
    
    sql += `
-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES ((SELECT id FROM recipes WHERE name = '${recipeName}' AND user_id = '${USER_ID}'), ${ingredientId}, ${ingredient.quantity});
`;
  }

  // Ajouter les ustensiles à la recette
  for (const tool of recipe.kitchen_tools) {
    const normalizedName = normalizeName(tool.name);
    const toolId = toolMap[normalizedName];
    
    if (!toolId) {
      console.error(`Erreur: ID de l'ustensile '${tool.name}' non trouvé dans le mapping`);
      continue;
    }
    
    sql += `
-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) 
VALUES ((SELECT id FROM recipes WHERE name = '${recipeName}' AND user_id = '${USER_ID}'), ${toolId});
`;
  }

  return sql;
}

// Fonction pour collecter tous les ingrédients et ustensiles manquants de toutes les recettes
function collectMissingItems(recipes, validIngredients, validKitchenTools) {
  const missingIngredients = [];
  const missingKitchenTools = [];
  
  // Créer un ensemble des noms d'ingrédients normalisés
  const ingredientNames = new Set(validIngredients.map(ingredient => 
    normalizeName(ingredient.name)));
  
  // Créer un ensemble des noms d'ustensiles normalisés
  const kitchenToolNames = new Set(validKitchenTools.map(tool => 
    normalizeName(tool.name)));
  
  // Parcourir toutes les recettes
  for (const recipe of recipes) {
    console.log(`\nVérification des ingrédients et ustensiles pour la recette: ${recipe.name}`);
    
    // Vérifier les ingrédients
    for (const ingredient of recipe.ingredients) {
      const normalizedName = normalizeName(ingredient.name);
      const existingIngredient = findIngredientByName(validIngredients, ingredient.name);
      
      // Vérifier si l'ingrédient existe dans la base de données
      if (!existingIngredient && !ingredientNames.has(normalizedName)) {
        // Vérifier si l'ingrédient est déjà dans la liste des ingrédients manquants
        const alreadyMissing = missingIngredients.some(item => 
          normalizeName(item.name) === normalizedName);
        
        if (!alreadyMissing) {
          missingIngredients.push(ingredient);
          ingredientNames.add(normalizedName); // Ajouter à l'ensemble pour éviter les doublons
        }
      } else if (!existingIngredient) {
        console.log(`Ingrédient trouvé par nom normalisé: ${ingredient.name}`);
      }
    }
    
    // Vérifier les ustensiles
    for (const tool of recipe.kitchen_tools) {
      const normalizedName = normalizeName(tool.name);
      const existingTool = findKitchenToolByName(validKitchenTools, tool.name);
      
      // Vérifier si l'ustensile existe dans la base de données
      if (!existingTool && !kitchenToolNames.has(normalizedName)) {
        // Vérifier si l'ustensile est déjà dans la liste des ustensiles manquants
        const alreadyMissing = missingKitchenTools.some(item => 
          normalizeName(item) === normalizedName);
        
        if (!alreadyMissing) {
          missingKitchenTools.push(tool.name);
          kitchenToolNames.add(normalizedName); // Ajouter à l'ensemble pour éviter les doublons
        }
      } else if (!existingTool) {
        console.log(`Ustensile trouvé par nom normalisé: ${tool.name}`);
      }
    }
  }
  
  return { missingIngredients, missingKitchenTools };
}

// Fonction principale
async function main() {
  try {
    // Créer une interface de ligne de commande interactive
    const rl = createInterface();
    
    // Demander le chemin du fichier de recette
    const recipePath = await askQuestion(rl, 'Chemin du fichier de recettes: ');
    
    // Lire le fichier de recette
    console.log(`Lecture du fichier de recettes: ${recipePath}`);
    const fileContent = JSON.parse(fs.readFileSync(recipePath, 'utf8'));
    
    // Vérifier si le fichier contient un tableau de recettes ou une seule recette
    const recipes = Array.isArray(fileContent) ? fileContent : [fileContent];
    
    console.log(`Nombre de recettes trouvées dans le fichier: ${recipes.length}`);
    
    // Récupérer les ingrédients et ustensiles de la base de données
    const { ingredients, kitchenTools } = getDatabaseItems();
    
    console.log(`Nombre d'ingrédients dans la base de données: ${ingredients.length}`);
    console.log(`Nombre d'ustensiles dans la base de données: ${kitchenTools.length}`);
    
    // Vérifier que les ingrédients et ustensiles ont les propriétés attendues
    const validIngredients = ingredients.filter(ingredient => 
      ingredient && ingredient.name && ingredient.id);
    
    const validKitchenTools = kitchenTools.filter(tool => 
      tool && tool.name && tool.id);
    
    console.log(`Nombre d'ingrédients valides dans la base de données: ${validIngredients.length}`);
    console.log(`Nombre d'ustensiles valides dans la base de données: ${validKitchenTools.length}`);
    
    // Afficher quelques ingrédients pour vérification
    console.log('\nExemples d\'ingrédients dans la base de données:');
    validIngredients.slice(0, 5).forEach(ingredient => {
      console.log(`- ${ingredient.name} (ID: ${ingredient.id})`);
    });
    
    // Afficher quelques ustensiles pour vérification
    console.log('\nExemples d\'ustensiles dans la base de données:');
    validKitchenTools.slice(0, 5).forEach(tool => {
      console.log(`- ${tool.name} (ID: ${tool.id})`);
    });
    
    // Collecter tous les ingrédients et ustensiles manquants de toutes les recettes
    const { missingIngredients, missingKitchenTools } = collectMissingItems(
      recipes, validIngredients, validKitchenTools);
    
    console.log(`\nNombre d'ingrédients manquants: ${missingIngredients.length}`);
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
          unit = await askQuestion(rl, `Unité pour ${ingredient.name} (g, ml, pcs): `);
        }
        
        if (!type) {
          type = await askQuestion(rl, `Type pour ${ingredient.name} (légume, fruit, viande, poisson, condiment, autre): `);
        }
        
        if (season === undefined) {
          season = await askQuestion(rl, `Saison pour ${ingredient.name} (spring, summer, autumn, winter, null): `);
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
        console.error('Vérifiez si la base de données supporte la clause INSERT OR IGNORE.');
        console.error('Si ce n\'est pas le cas, modifiez le script pour utiliser une autre approche.');
        rl.close();
        return;
      }
    }
    
    // Récupérer à nouveau les ingrédients et ustensiles de la base de données
    const { ingredients: updatedIngredients, kitchenTools: updatedKitchenTools } = getDatabaseItems();
    
    // Vérifier que les ingrédients et ustensiles ont les propriétés attendues
    const validUpdatedIngredients = updatedIngredients.filter(ingredient => 
      ingredient && ingredient.name && ingredient.id);
    
    const validUpdatedKitchenTools = updatedKitchenTools.filter(tool => 
      tool && tool.name && tool.id);
    
    console.log(`Nombre d'ingrédients valides après mise à jour: ${validUpdatedIngredients.length}`);
    console.log(`Nombre d'ustensiles valides après mise à jour: ${validUpdatedKitchenTools.length}`);
    
    // Créer un mapping des noms d'ingrédients vers leurs IDs
    const ingredientMap = {};
    validUpdatedIngredients.forEach(ingredient => {
      ingredientMap[normalizeName(ingredient.name)] = ingredient.id;
    });
    
    // Créer un mapping des noms d'ustensiles vers leurs IDs
    const toolMap = {};
    validUpdatedKitchenTools.forEach(tool => {
      toolMap[normalizeName(tool.name)] = tool.id;
    });
    
    // Ajouter toutes les recettes une par une
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      console.log(`\nAjout de la recette ${i + 1}/${recipes.length}: ${recipe.name}`);
      
      // Vérifier que tous les ingrédients et ustensiles sont disponibles pour cette recette
      let allItemsAvailable = true;
      
      for (const ingredient of recipe.ingredients) {
        const normalizedName = normalizeName(ingredient.name);
        if (!ingredientMap[normalizedName]) {
          console.error(`Erreur: L'ingrédient '${ingredient.name}' n'est pas disponible dans la base de données.`);
          allItemsAvailable = false;
        }
      }
      
      for (const tool of recipe.kitchen_tools) {
        const normalizedName = normalizeName(tool.name);
        if (!toolMap[normalizedName]) {
          console.error(`Erreur: L'ustensile '${tool.name}' n'est pas disponible dans la base de données.`);
          allItemsAvailable = false;
        }
      }
      
      if (!allItemsAvailable) {
        console.error(`Certains ingrédients ou ustensiles ne sont pas disponibles pour la recette '${recipe.name}'.`);
        console.error('La recette ne peut pas être ajoutée.');
        continue;
      }
      
      // Générer le SQL pour ajouter la recette
      const recipeSql = generateAddRecipeSQL(recipe, ingredientMap, toolMap);
      
      // Écrire le SQL dans un fichier
      fs.writeFileSync(TEMP_SQL_FILE, recipeSql);
      console.log(`SQL d'ajout de la recette écrit dans le fichier: ${TEMP_SQL_FILE}`);
      
      // Exécuter le SQL
      console.log('Exécution du SQL d\'ajout de la recette...');
      const recipeOutput = executeCommand(`wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --file=${TEMP_SQL_FILE}`);
      
      if (recipeOutput && !recipeOutput.includes('ERROR')) {
        console.log(`Ajout de la recette '${recipe.name}' réussi!`);
      } else {
        console.error(`Erreur lors de l'ajout de la recette '${recipe.name}'`);
      }
    }
    
    // Fermer l'interface de ligne de commande
    rl.close();
    
    // Ne pas supprimer le fichier SQL pour permettre le débogage
    console.log(`Le fichier SQL a été conservé pour le débogage: ${TEMP_SQL_FILE}`);
    
    console.log('\nTraitement terminé!');
    console.log(`Nombre total de recettes traitées: ${recipes.length}`);
    
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter la fonction principale
main();