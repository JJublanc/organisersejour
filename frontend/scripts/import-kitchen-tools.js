import fs from 'fs/promises';
import path from 'path';
import { getNeonDbUrl, getDbClient } from '../src/lib/server/db.ts';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement depuis .env à la racine du dossier frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Charge .env depuis la racine de frontend/ (ex: frontend/.env)

const KITCHEN_TOOLS_FILE_PATH = path.join(__dirname, 'sample-data/kitchen_tools.json');

async function ensureKitchenToolExists(db, toolData) {
  const { name } = toolData;

  let result = await db`SELECT id FROM kitchen_tools WHERE name = ${name}`;
  if (result.length > 0) {
    console.log(`  L'ustensile "${name}" existe déjà (ID: ${result[0].id}). Skip.`);
    return result[0].id;
  } else {
    result = await db`
      INSERT INTO kitchen_tools (name)
      VALUES (${name})
      RETURNING id`;
    console.log(`  Créé ustensile: "${name}" (ID: ${result[0].id})`);
    return result[0].id;
  }
}

async function main() {
  let db;
  try {
    const targetEnvArg = process.argv[2]; // Récupère le premier argument (ex: dev, preprod, prod)
    if (!targetEnvArg) {
      console.error("Veuillez spécifier l'environnement cible en argument (ex: dev, preprod, prod).");
      console.error("Usage: node scripts/import-kitchen-tools.js <environnement>");
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

    const kitchenToolsFileJson = await fs.readFile(KITCHEN_TOOLS_FILE_PATH, 'utf-8');
    const data = JSON.parse(kitchenToolsFileJson);
    const kitchenToolsToImport = data.kitchen_tools; // Accéder au tableau d'ustensiles

    if (!Array.isArray(kitchenToolsToImport)) {
        console.error("Le fichier JSON ne contient pas un tableau d'ustensiles à la clé 'kitchen_tools'.");
        process.exit(1);
    }

    console.log(`\nDébut de l'importation/vérification de ${kitchenToolsToImport.length} ustensiles de cuisine...`);

    for (const tool of kitchenToolsToImport) {
      await db.begin(async (sql) => {
        await ensureKitchenToolExists(sql, tool);
      });
    }

    console.log('\nImportation/Vérification des ustensiles de cuisine terminée !');
  } catch (error) {
    console.error("\nErreur lors de l'importation des ustensiles de cuisine:", error);
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