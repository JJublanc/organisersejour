import fs from 'fs/promises';
import path from 'path';
import { getNeonDbUrl, getDbClient } from '../src/lib/server/db.ts';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement depuis .env à la racine du dossier frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Charge .env depuis la racine de frontend/ (ex: frontend/.env)

const RECIPES_FILE_PATH = path.join(__dirname, 'sample-data/recipes.json');
const USER_ID_FOR_IMPORT = 'system';

async function getOrCreateIngredient(db, ingredientData) {
  const { name, unit, type, season: rawSeason } = ingredientData;
  const season = rawSeason === 'null' ? null : rawSeason;

  let result = await db`SELECT id FROM ingredients WHERE name = ${name}`;
  if (result.length > 0) {
    return result[0].id;
  } else {
    result = await db`
      INSERT INTO ingredients (name, unit, type, season)
      VALUES (${name}, ${unit}, ${type || 'autre'}, ${season})
      RETURNING id`;
    console.log(`  Créé ingrédient: ${name} (ID: ${result[0].id})`);
    return result[0].id;
  }
}

async function getOrCreateKitchenTool(db, toolData) {
  const { name } = toolData;
  let result = await db`SELECT id FROM kitchen_tools WHERE name = ${name}`;
  if (result.length > 0) {
    return result[0].id;
  } else {
    result = await db`
      INSERT INTO kitchen_tools (name)
      VALUES (${name})
      RETURNING id`;
    console.log(`  Créé ustensile: ${name} (ID: ${result[0].id})`);
    return result[0].id;
  }
}

async function importRecipe(db, recipeData) {
  console.log(`\nImport de la recette: ${recipeData.name}`);

  await db.begin(async (sql) => {
    const ingredientInfos = [];
    for (const ingredient of recipeData.ingredients) {
      const ingredientId = await getOrCreateIngredient(sql, ingredient);
      ingredientInfos.push({ 
        id: ingredientId, 
        quantity: ingredient.quantity, 
        // unit: ingredient.unit // L'unité est dans la table ingredients, pas recipe_ingredients
      });
    }

    const kitchenToolIds = [];
    for (const tool of recipeData.kitchen_tools) {
      const toolId = await getOrCreateKitchenTool(sql, tool);
      kitchenToolIds.push(toolId);
    }
    
    const season = recipeData.season === 'null' ? null : recipeData.season;

    const [newRecipe] = await sql`
      INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
      VALUES (
        ${recipeData.name}, 
        ${recipeData.description}, 
        ${recipeData.prep_time_minutes}, 
        ${recipeData.cook_time_minutes}, 
        ${recipeData.instructions}, 
        ${recipeData.servings},
        ${season},
        ${USER_ID_FOR_IMPORT}
      )
      RETURNING id`;
    
    console.log(`  Recette "${recipeData.name}" insérée avec ID: ${newRecipe.id}`);

    for (const ingInfo of ingredientInfos) {
      await sql`
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity)
        VALUES (${newRecipe.id}, ${ingInfo.id}, ${ingInfo.quantity})`;
    }
    console.log(`    ${ingredientInfos.length} ingrédients liés.`);

    for (const toolId of kitchenToolIds) {
      await sql`
        INSERT INTO recipe_kitchen_tools (recipe_id, tool_id)
        VALUES (${newRecipe.id}, ${toolId})`;
    }
    console.log(`    ${kitchenToolIds.length} ustensiles liés.`);
  });
  console.log(`Recette "${recipeData.name}" importée avec succès.`);
}

async function main() {
  let db;
  try {
    const targetEnvArg = process.argv[2]; // Récupère le premier argument (ex: dev, preprod, prod)
    if (!targetEnvArg) {
      console.error("Veuillez spécifier l'environnement cible en argument (ex: dev, preprod, prod).");
      console.error("Usage: node scripts/import-recipes.js <environnement>");
      process.exit(1);
    }

    console.log(`Environnement cible spécifié: ${targetEnvArg}`);

    // Crée un objet env simulé pour getNeonDbUrl
    const scriptEnv = {
      ...process.env, // Garde les autres variables d'environnement
      ENVIRONMENT: targetEnvArg.toLowerCase() // Définit l'environnement cible
    };

    // Utilisation de process.env pour récupérer les variables d'environnement
    // Assurez-vous que NEON_DEV_URL (ou équivalent) est défini dans votre environnement
    // ou via un fichier .env chargé au début du script.
    const dbUrl = getNeonDbUrl(scriptEnv);
    if (!dbUrl) {
      console.error(`L'URL de la base de données Neon pour l'environnement '${targetEnvArg}' n'a pas pu être déterminée.`);
      console.error("Vérifiez vos variables d'environnement (ex: NEON_DEV_URL, NEON_PREPROD_URL, etc.) et la configuration dans getNeonDbUrl.");
      process.exit(1);
    }
    db = getDbClient(dbUrl);
    console.log('Connecté à la base de données.');

    const recipesJson = await fs.readFile(RECIPES_FILE_PATH, 'utf-8');
    const recipesToImport = JSON.parse(recipesJson);

    console.log(`Début de l'importation de ${recipesToImport.length} recettes...`);

    for (const recipe of recipesToImport) {
      await importRecipe(db, recipe);
    }

    console.log('\nImportation terminée avec succès !');
  } catch (error) {
    console.error("\nErreur lors de l'importation des recettes:", error);
    process.exit(1);
  } finally {
    if (db) {
      await db.end();
      console.log('Connexion à la base de données fermée.');
    }
    console.log('Script terminé.');
  }
}

main();