/**
 * Script pour vérifier si les ingrédients et ustensiles utilisés dans les recettes
 * existent dans la base de données
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
    
    // Créer un ensemble des IDs d'ingrédients et d'ustensiles existants dans la base de données
    const existingIngredientIds = new Set(ingredients.map(ingredient => ingredient.id));
    const existingToolIds = new Set(kitchenTools.map(tool => tool.id));
    
    // Créer un mapping des IDs vers les noms
    const ingredientIdToName = {};
    const toolIdToName = {};
    
    ingredients.forEach(ingredient => {
      ingredientIdToName[ingredient.id] = ingredient.name;
    });
    
    kitchenTools.forEach(tool => {
      toolIdToName[tool.id] = tool.name;
    });
    
    // Vérifier si les IDs utilisés dans les recettes correspondent à des ingrédients et ustensiles existants
    const missingIngredientIds = new Set();
    const missingToolIds = new Set();
    
    for (const recipe of recipes) {
      console.log(`\nVérification de la recette: ${recipe.name}`);
      
      // Vérifier les ingrédients
      for (const ingredient of recipe.ingredients) {
        const ingredientId = ingredient.ingredient_id;
        
        if (!existingIngredientIds.has(ingredientId)) {
          missingIngredientIds.add(ingredientId);
          console.log(`  - Ingrédient manquant: ID ${ingredientId}`);
        } else {
          console.log(`  - Ingrédient trouvé: ID ${ingredientId} (${ingredientIdToName[ingredientId]})`);
        }
      }
      
      // Vérifier les ustensiles
      for (const tool of recipe.kitchen_tools) {
        const toolId = tool.id;
        
        if (!existingToolIds.has(toolId)) {
          missingToolIds.add(toolId);
          console.log(`  - Ustensile manquant: ID ${toolId}`);
        } else {
          console.log(`  - Ustensile trouvé: ID ${toolId} (${toolIdToName[toolId]})`);
        }
      }
    }
    
    // Afficher un résumé
    console.log('\nRésumé:');
    console.log(`Nombre d'ingrédients manquants: ${missingIngredientIds.size}`);
    console.log(`Nombre d'ustensiles manquants: ${missingToolIds.size}`);
    
    if (missingIngredientIds.size > 0) {
      console.log('\nIDs d\'ingrédients manquants:');
      console.log([...missingIngredientIds].join(', '));
    }
    
    if (missingToolIds.size > 0) {
      console.log('\nIDs d\'ustensiles manquants:');
      console.log([...missingToolIds].join(', '));
    }
    
    if (missingIngredientIds.size === 0 && missingToolIds.size === 0) {
      console.log('\nTous les ingrédients et ustensiles existent dans la base de données.');
    } else {
      console.log('\nCertains ingrédients ou ustensiles sont manquants dans la base de données.');
      console.log('Vous devez les ajouter avant d\'importer les recettes.');
    }
    
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter la fonction principale
main();