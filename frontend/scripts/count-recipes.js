/**
 * Script pour compter le nombre de recettes dans la base de données
 * et afficher la liste des recettes avec leurs informations
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Fonction pour analyser la sortie de la base de données
function parseDbOutput(output) {
  if (!output) return [];
  
  try {
    // Rechercher un tableau JSON dans la sortie
    const jsonRegex = /\[\s*\{.*\}\s*\]/s;
    const match = output.match(jsonRegex);
    
    if (!match) {
      console.error('Impossible de trouver un tableau JSON dans la sortie');
      return [];
    }
    
    const jsonString = match[0];
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

// Fonction principale
async function main() {
  try {
    // Créer une interface de ligne de commande interactive
    const rl = createInterface();
    
    // Demander à l'utilisateur s'il veut filtrer par user_id
    const filterByUser = await askQuestion(rl, 'Voulez-vous filtrer par user_id? (oui/non): ');
    
    let userId = null;
    if (filterByUser.toLowerCase() === 'oui') {
      userId = await askQuestion(rl, 'Entrez le user_id (laissez vide pour "system"): ');
      if (!userId) {
        userId = 'system';
      }
    }
    
    // Construire la requête SQL pour compter les recettes
    let countQuery = 'SELECT COUNT(*) as count FROM recipes';
    if (userId) {
      countQuery += ` WHERE user_id = '${userId}'`;
    }
    
    // Exécuter la requête SQL pour compter les recettes
    console.log('Comptage des recettes dans la base de données...');
    const countOutput = executeCommand(`wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --command="${countQuery}"`);
    
    // Analyser la sortie
    const countResults = parseDbOutput(countOutput);
    
    if (countResults.length > 0) {
      const recipeCount = countResults[0].count;
      console.log(`\nNombre total de recettes${userId ? ` pour l'utilisateur '${userId}'` : ''}: ${recipeCount}`);
    } else {
      console.error('Impossible de compter les recettes dans la base de données.');
      rl.close();
      return;
    }
    
    // Demander à l'utilisateur s'il veut voir la liste des recettes
    const showList = await askQuestion(rl, 'Voulez-vous voir la liste des recettes? (oui/non): ');
    
    if (showList.toLowerCase() === 'oui') {
      // Construire la requête SQL pour récupérer les recettes
      let listQuery = 'SELECT id, name, season, user_id FROM recipes';
      if (userId) {
        listQuery += ` WHERE user_id = '${userId}'`;
      }
      listQuery += ' ORDER BY name';
      
      // Exécuter la requête SQL pour récupérer les recettes
      console.log('Récupération de la liste des recettes...');
      const listOutput = executeCommand(`wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --command="${listQuery}"`);
      
      // Analyser la sortie
      const recipes = parseDbOutput(listOutput);
      
      if (recipes.length > 0) {
        console.log('\nListe des recettes:');
        console.log('------------------');
        
        // Afficher les recettes par saison
        const seasons = ['spring', 'summer', 'autumn', 'winter', null];
        
        for (const season of seasons) {
          const seasonRecipes = recipes.filter(recipe => recipe.season === season);
          
          if (seasonRecipes.length > 0) {
            console.log(`\n${season ? season.toUpperCase() : 'SANS SAISON'} (${seasonRecipes.length} recettes):`);
            
            seasonRecipes.forEach(recipe => {
              console.log(`- [${recipe.id}] ${recipe.name} (${recipe.user_id})`);
            });
          }
        }
      } else {
        console.log('Aucune recette trouvée dans la base de données.');
      }
    }
    
    // Demander à l'utilisateur s'il veut voir les détails d'une recette spécifique
    const showDetails = await askQuestion(rl, "Voulez-vous voir les détails d'une recette spécifique? (oui/non): ");
    
    if (showDetails.toLowerCase() === 'oui') {
      const recipeId = await askQuestion(rl, 'Entrez l\'ID de la recette: ');
      
      // Construire la requête SQL pour récupérer les détails de la recette
      const detailsQuery = `
        SELECT r.id, r.name, r.description, r.prep_time_minutes, r.cook_time_minutes, 
               r.instructions, r.servings, r.season, r.user_id
        FROM recipes r
        WHERE r.id = ${recipeId}
      `;
      
      // Exécuter la requête SQL pour récupérer les détails de la recette
      console.log('Récupération des détails de la recette...');
      const detailsOutput = executeCommand(`wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --command="${detailsQuery}"`);
      
      // Analyser la sortie
      const recipeDetails = parseDbOutput(detailsOutput);
      
      if (recipeDetails.length > 0) {
        const recipe = recipeDetails[0];
        
        console.log('\nDétails de la recette:');
        console.log('---------------------');
        console.log(`ID: ${recipe.id}`);
        console.log(`Nom: ${recipe.name}`);
        console.log(`Description: ${recipe.description}`);
        console.log(`Temps de préparation: ${recipe.prep_time_minutes} minutes`);
        console.log(`Temps de cuisson: ${recipe.cook_time_minutes} minutes`);
        console.log(`Nombre de portions: ${recipe.servings}`);
        console.log(`Saison: ${recipe.season || 'Aucune'}`);
        console.log(`User ID: ${recipe.user_id}`);
        console.log('\nInstructions:');
        console.log(recipe.instructions);
        
        // Récupérer les ingrédients de la recette
        const ingredientsQuery = `
          SELECT i.name, ri.quantity, i.unit
          FROM recipe_ingredients ri
          JOIN ingredients i ON ri.ingredient_id = i.id
          WHERE ri.recipe_id = ${recipeId}
          ORDER BY i.name
        `;
        
        const ingredientsOutput = executeCommand(`wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --command="${ingredientsQuery}"`);
        const ingredients = parseDbOutput(ingredientsOutput);
        
        if (ingredients.length > 0) {
          console.log('\nIngrédients:');
          ingredients.forEach(ingredient => {
            console.log(`- ${ingredient.name}: ${ingredient.quantity} ${ingredient.unit}`);
          });
        } else {
          console.log('\nAucun ingrédient trouvé pour cette recette.');
        }
        
        // Récupérer les ustensiles de la recette
        const toolsQuery = `
          SELECT kt.name
          FROM recipe_kitchen_tools rkt
          JOIN kitchen_tools kt ON rkt.tool_id = kt.id
          WHERE rkt.recipe_id = ${recipeId}
          ORDER BY kt.name
        `;
        
        const toolsOutput = executeCommand(`wrangler d1 execute hello-db --local --config=/Users/jjublanc/projets_perso/organisersejour/frontend/wrangler.toml --command="${toolsQuery}"`);
        const tools = parseDbOutput(toolsOutput);
        
        if (tools.length > 0) {
          console.log('\nUstensiles:');
          tools.forEach(tool => {
            console.log(`- ${tool.name}`);
          });
        } else {
          console.log('\nAucun ustensile trouvé pour cette recette.');
        }
      } else {
        console.log(`Aucune recette trouvée avec l'ID ${recipeId}.`);
      }
    }
    
    // Fermer l'interface de ligne de commande
    rl.close();
    
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter la fonction principale
main();