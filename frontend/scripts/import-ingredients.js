import fs from 'fs/promises';
import path from 'path';
import { getNeonDbUrl, getDbClient } from '../src/lib/server/db.ts';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement depuis .env à la racine du dossier frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Charge .env depuis la racine de frontend/ (ex: frontend/.env)

const INGREDIENTS_FILE_PATH = path.join(__dirname, 'sample-data/ingredients.json');

async function ensureIngredientExists(db, ingredientData) {
  const { name, unit, type, season: rawSeason } = ingredientData;
  const season = rawSeason === null || rawSeason === 'null' ? null : rawSeason; // Gère null et la chaîne "null"

  let result = await db`SELECT id FROM ingredients WHERE name = ${name}`;
  if (result.length > 0) {
    console.log(`  L'ingrédient "${name}" existe déjà (ID: ${result[0].id}). Skip.`);
    return result[0].id;
  } else {
    // S'assurer que le type a une valeur, sinon utiliser la valeur par défaut de la DB ('autre')
    const typeToInsert = type || 'autre';
    const userIdToInsert = 'system'; // Assigner 'system' comme user_id
    result = await db`
      INSERT INTO ingredients (name, unit, type, season, user_id)
      VALUES (${name}, ${unit}, ${typeToInsert}, ${season}, ${userIdToInsert})
      RETURNING id`;
    console.log(`  Créé ingrédient: "${name}" (ID: ${result[0].id}) avec type: ${typeToInsert}, saison: ${season}, user_id: ${userIdToInsert}`);
    return result[0].id;
  }
}

async function main() {
  let db;
  try {
    const targetEnvArg = process.argv[2]; // Récupère le premier argument (ex: dev, preprod, prod)
    if (!targetEnvArg) {
      console.error("Veuillez spécifier l'environnement cible en argument (ex: dev, preprod, prod).");
      console.error("Usage: node scripts/import-ingredients.js <environnement>");
      process.exit(1);
    }
    console.log(`Environnement cible spécifié: ${targetEnvArg}`);

    const scriptEnv = { 
      ...process.env,
      ENVIRONMENT: targetEnvArg.toLowerCase()
    };

    const dbUrl = getNeonDbUrl(scriptEnv); 
    if (!dbUrl) {
      console.error(`L'URL de la base de données Neon pour l'environnement '${targetEnvArg}' n'a pas pu être déterminée.`);
      console.error("Vérifiez vos variables d'environnement (ex: NEON_DEV_URL, NEON_PREPROD_URL, etc.) et la configuration dans getNeonDbUrl.");
      process.exit(1);
    }
    db = getDbClient(dbUrl);
    console.log('Connecté à la base de données.');

    const ingredientsFileJson = await fs.readFile(INGREDIENTS_FILE_PATH, 'utf-8');
    const data = JSON.parse(ingredientsFileJson);
    const ingredientsToImport = data.ingredients; // Accéder au tableau d'ingrédients

    if (!Array.isArray(ingredientsToImport)) {
        console.error("Le fichier JSON ne contient pas un tableau d'ingrédients à la clé 'ingredients'.");
        process.exit(1);
    }

    console.log(`\nDébut de l'importation/vérification de ${ingredientsToImport.length} ingrédients...`);

    for (const ingredient of ingredientsToImport) {
      // Envelopper chaque insertion dans une transaction pour la robustesse, même si c'est une seule insertion.
      await db.begin(async (sql) => {
        await ensureIngredientExists(sql, ingredient);
      });
    }

    console.log('\nImportation/Vérification des ingrédients terminée !');
  } catch (error) {
    console.error("\nErreur lors de l'importation des ingrédients:", error);
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