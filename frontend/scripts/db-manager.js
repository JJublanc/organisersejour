#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import readlineSync from 'readline-sync';

// Get the directory name equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Default environment to use (production, preview, or development)
  DEFAULT_ENV: 'development',
  // Output format for list operation (json or table)
  DEFAULT_OUTPUT_FORMAT: 'table'
};

// Command line arguments parsing
const args = process.argv.slice(2);
let operation = null;
let dataFile = null;
let environment = CONFIG.DEFAULT_ENV;
let outputFormat = CONFIG.DEFAULT_OUTPUT_FORMAT;
let itemType = null;

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--add' || arg === '--delete' || arg === '--list') {
    operation = arg.substring(2); // Remove the '--'
  } else if (arg === '--delete-all') {
    operation = 'delete-all'; // Special operation to delete all system items
  } else if (arg === '--delete-kitchen-tools') {
    operation = 'delete-kitchen-tools'; // Special operation to delete all kitchen tools
  } else if (arg === '--file' && i + 1 < args.length) {
    dataFile = args[i + 1];
    i++; // Skip the next argument as it's the file path
  } else if (arg === '--env' && i + 1 < args.length) {
    environment = args[i + 1];
    i++; // Skip the next argument as it's the environment
  } else if (arg === '--type' && i + 1 < args.length) {
    itemType = args[i + 1];
    i++; // Skip the next argument as it's the item type
  } else if (arg === '--format' && i + 1 < args.length) {
    outputFormat = args[i + 1];
    i++; // Skip the next argument as it's the output format
  } else if (arg === '--help') {
    printHelp();
    process.exit(0);
  }
}

// Print help information
function printHelp() {
  console.log(`
Database Manager - A tool to manage system items in the database

Usage:
  node db-manager.js [options]

Options:
  --add                 Add items to the database
  --delete              Delete items from the database
  --delete-all          Delete all system items from the database
  --delete-kitchen-tools Delete all kitchen tools from the database
  --list                List items from the database
  --file <path>         Path to the JSON file containing the data (required for add/delete)
  --type <type>         Type of items to list (ingredients, recipes, kitchen_tools, all)
  --format <format>     Output format for list operation (table, json)
  --env <environment>   Environment to use (production, preview, development)
  --help                Show this help message

Examples:
  node db-manager.js --add --file sample-data/ingredients.json
  node db-manager.js --delete --file sample-data/delete_items.json --env production
  node db-manager.js --delete-all --env development
  node db-manager.js --delete-kitchen-tools --env development
  node db-manager.js --list --type ingredients
  node db-manager.js --list --type all --format json --env production
`);
}

// Validate required arguments
if (!operation) {
  console.error('Error: Operation (--add, --delete, --delete-all, --delete-kitchen-tools, or --list) is required');
  printHelp();
  process.exit(1);
}

// For add and delete operations, a data file is required
if ((operation === 'add' || operation === 'delete') && !dataFile) {
  console.error('Error: Data file (--file) is required for add and delete operations');
  printHelp();
  process.exit(1);
}

// For delete-all operation, ask for confirmation
if (operation === 'delete-all') {
  console.log('\n⚠️  WARNING: You are about to delete ALL system items from the database!');
  console.log('This action cannot be undone and will remove all system recipes, ingredients, and kitchen tools.');
  console.log('Please type "DELETE ALL" to confirm:');
  
  const confirmation = readlineSync.question('> ');
  
  if (confirmation !== 'DELETE ALL') {
    console.log('Operation cancelled.');
    process.exit(0);
  }
  
  console.log('Proceeding with deletion of all system items...');
}

// For delete-kitchen-tools operation, ask for confirmation
if (operation === 'delete-kitchen-tools') {
  console.log('\n⚠️  WARNING: You are about to delete ALL kitchen tools from the database!');
  console.log('This action cannot be undone and will remove all kitchen tools.');
  console.log('Please type "DELETE KITCHEN TOOLS" to confirm:');
  
  const confirmation = readlineSync.question('> ');
  
  if (confirmation !== 'DELETE KITCHEN TOOLS') {
    console.log('Operation cancelled.');
    process.exit(0);
  }
  
  console.log('Proceeding with deletion of all kitchen tools...');
}

// For list operation, validate item type if provided
if (operation === 'list') {
  if (itemType && !['ingredients', 'recipes', 'kitchen_tools', 'all'].includes(itemType)) {
    console.error('Error: Invalid item type. Must be one of: ingredients, recipes, kitchen_tools, all');
    printHelp();
    process.exit(1);
  }
  
  // Default to 'all' if not specified
  if (!itemType) {
    itemType = 'all';
  }
  
  // Validate output format
  if (outputFormat && !['table', 'json'].includes(outputFormat)) {
    console.error('Error: Invalid output format. Must be one of: table, json');
    printHelp();
    process.exit(1);
  }
}

// Variable to store data from JSON file
let data;

// Read and parse the data file only for add and delete operations
if (operation === 'add' || operation === 'delete') {
  try {
    const fileContent = fs.readFileSync(dataFile, 'utf8');
    data = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading or parsing data file: ${error.message}`);
    process.exit(1);
  }
}

// Validate the data structure
function validateData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Data must be a valid JSON object');
  }

  // Check if the data contains valid sections
  const validSections = ['ingredients', 'recipes', 'kitchen_tools'];
  const providedSections = Object.keys(data);
  
  const validSection = providedSections.some(section => validSections.includes(section));
  if (!validSection) {
    throw new Error(`Data must contain at least one of: ${validSections.join(', ')}`);
  }

  // Validate each section
  if (data.ingredients) {
    if (!Array.isArray(data.ingredients)) {
      throw new Error('Ingredients must be an array');
    }
    
    data.ingredients.forEach((ingredient, index) => {
      if (!ingredient.name || !ingredient.unit || !ingredient.type) {
        throw new Error(`Ingredient at index ${index} is missing required fields (name, unit, type)`);
      }
      
      // Validate ingredient type
      const validTypes = ['boisson', 'pain', 'condiment', 'légume', 'fruit', 'viande', 'poisson', 'autre'];
      if (!validTypes.includes(ingredient.type)) {
        throw new Error(`Ingredient at index ${index} has invalid type. Valid types: ${validTypes.join(', ')}`);
      }
      
      // Validate season if provided
      if (ingredient.season !== undefined && ingredient.season !== null) {
        const validSeasons = ['spring', 'summer', 'autumn', 'winter'];
        if (!validSeasons.includes(ingredient.season)) {
          throw new Error(`Ingredient at index ${index} has invalid season. Valid seasons: ${validSeasons.join(', ')}`);
        }
      }
    });
  }

  if (data.kitchen_tools) {
    if (!Array.isArray(data.kitchen_tools)) {
      throw new Error('Kitchen tools must be an array');
    }
    
    data.kitchen_tools.forEach((tool, index) => {
      if (!tool.name) {
        throw new Error(`Kitchen tool at index ${index} is missing required field (name)`);
      }
    });
  }

  if (data.recipes) {
    if (!Array.isArray(data.recipes)) {
      throw new Error('Recipes must be an array');
    }
    
    data.recipes.forEach((recipe, index) => {
      if (!recipe.name || recipe.servings === undefined) {
        throw new Error(`Recipe at index ${index} is missing required fields (name, servings)`);
      }
      
      // Validate season if provided
      if (recipe.season !== undefined && recipe.season !== null) {
        const validSeasons = ['spring', 'summer', 'autumn', 'winter'];
        if (!validSeasons.includes(recipe.season)) {
          throw new Error(`Recipe at index ${index} has invalid season. Valid seasons: ${validSeasons.join(', ')}`);
        }
      }
      
      // Validate ingredients if provided
      if (recipe.ingredients) {
        if (!Array.isArray(recipe.ingredients)) {
          throw new Error(`Recipe at index ${index} has invalid ingredients (must be an array)`);
        }
        
        recipe.ingredients.forEach((ingredient, ingIndex) => {
          if (!ingredient.ingredient_id || ingredient.quantity === undefined) {
            throw new Error(`Recipe ${recipe.name} ingredient at index ${ingIndex} is missing required fields (ingredient_id, quantity)`);
          }
        });
      }
      
      // Validate kitchen tools if provided
      if (recipe.kitchen_tools) {
        if (!Array.isArray(recipe.kitchen_tools)) {
          throw new Error(`Recipe at index ${index} has invalid kitchen tools (must be an array)`);
        }
        
        recipe.kitchen_tools.forEach((tool, toolIndex) => {
          if (!tool.id) {
            throw new Error(`Recipe ${recipe.name} kitchen tool at index ${toolIndex} is missing required field (id)`);
          }
        });
      }
    });
  }

  return true;
}

// Validate data for add and delete operations
if (operation === 'add' || operation === 'delete') {
  try {
    validateData(data);
  } catch (error) {
    console.error(`Error validating data: ${error.message}`);
    process.exit(1);
  }
}

// Generate SQL for adding items
function generateAddSql(data) {
  let sql = '';
  
  // Add ingredients
  if (data.ingredients && data.ingredients.length > 0) {
    data.ingredients.forEach(ingredient => {
      sql += `
-- Use INSERT OR IGNORE to handle existing ingredients
INSERT OR IGNORE INTO ingredients (name, unit, type, season, user_id)
VALUES ('${escapeString(ingredient.name)}', '${escapeString(ingredient.unit)}', '${escapeString(ingredient.type)}', ${ingredient.season ? `'${escapeString(ingredient.season)}'` : 'NULL'}, 'system');
`;
    });
  }
  
  // Add kitchen tools
  if (data.kitchen_tools && data.kitchen_tools.length > 0) {
    data.kitchen_tools.forEach(tool => {
      sql += `
-- Use INSERT OR IGNORE to handle existing kitchen tools
INSERT OR IGNORE INTO kitchen_tools (name)
VALUES ('${escapeString(tool.name)}');
`;
    });
  }
  
  // Add recipes (more complex as it involves multiple tables)
  if (data.recipes && data.recipes.length > 0) {
    data.recipes.forEach(recipe => {
      // First, check if the recipe already exists and delete its relationships if it does
      sql += `
-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = '${escapeString(recipe.name)}' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = '${escapeString(recipe.name)}' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = '${escapeString(recipe.name)}' AND user_id = 'system';

-- Insert recipe: ${recipe.name}
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  '${escapeString(recipe.name)}',
  ${recipe.description ? `'${escapeString(recipe.description)}'` : 'NULL'},
  ${recipe.prep_time_minutes || 'NULL'},
  ${recipe.cook_time_minutes || 'NULL'},
  ${recipe.instructions ? `'${escapeString(recipe.instructions)}'` : 'NULL'},
  ${recipe.servings},
  ${recipe.season ? `'${escapeString(recipe.season)}'` : 'NULL'},
  'system'
);

-- Get the last inserted recipe ID
`;

      // For recipe ingredients
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        recipe.ingredients.forEach(ingredient => {
          sql += `
-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), ${ingredient.ingredient_id}, ${ingredient.quantity});
`;
        });
      }
      
      // For recipe kitchen tools
      if (recipe.kitchen_tools && recipe.kitchen_tools.length > 0) {
        recipe.kitchen_tools.forEach(tool => {
          sql += `
-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), ${tool.id});
`;
        });
      }
      
      sql += '\n';
    });
  }
  
  return sql;
}

// Generate SQL for deleting items
function generateDeleteSql(data) {
  let sql = '';
  
  // Delete recipes (must be done first due to foreign key constraints)
  if (data.recipes && data.recipes.length > 0) {
    data.recipes.forEach(recipe => {
      if (recipe.id) {
        // First delete from recipe_ingredients and recipe_kitchen_tools
        sql += `
-- Delete recipe ${recipe.id} relationships
DELETE FROM recipe_ingredients WHERE recipe_id = ${recipe.id};
DELETE FROM recipe_kitchen_tools WHERE recipe_id = ${recipe.id};
-- Delete the recipe
DELETE FROM recipes WHERE id = ${recipe.id} AND user_id = 'system';
`;
      } else if (recipe.name) {
        // If ID is not provided, use name (less reliable)
        sql += `
-- Delete recipe by name: ${recipe.name}
-- First get the recipe ID
WITH recipe_to_delete AS (
  SELECT id FROM recipes WHERE name = '${escapeString(recipe.name)}' AND user_id = 'system'
)
-- Delete from recipe_ingredients
DELETE FROM recipe_ingredients 
WHERE recipe_id IN (SELECT id FROM recipe_to_delete);

-- Delete from recipe_kitchen_tools
WITH recipe_to_delete AS (
  SELECT id FROM recipes WHERE name = '${escapeString(recipe.name)}' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools 
WHERE recipe_id IN (SELECT id FROM recipe_to_delete);

-- Delete the recipe
DELETE FROM recipes 
WHERE name = '${escapeString(recipe.name)}' AND user_id = 'system';
`;
      }
    });
  }
  
  // Delete ingredients
  if (data.ingredients && data.ingredients.length > 0) {
    data.ingredients.forEach(ingredient => {
      if (ingredient.id) {
        sql += `
-- Delete ingredient ${ingredient.id}
DELETE FROM ingredients WHERE id = ${ingredient.id} AND user_id = 'system';
`;
      } else if (ingredient.name) {
        sql += `
-- Delete ingredient by name: ${ingredient.name}
DELETE FROM ingredients WHERE name = '${escapeString(ingredient.name)}' AND user_id = 'system';
`;
      }
    });
  }
  
  // Delete kitchen tools
  if (data.kitchen_tools && data.kitchen_tools.length > 0) {
    data.kitchen_tools.forEach(tool => {
      if (tool.id) {
        sql += `
-- Delete kitchen tool ${tool.id}
DELETE FROM kitchen_tools WHERE id = ${tool.id};
`;
      } else if (tool.name) {
        sql += `
-- Delete kitchen tool by name: ${tool.name}
DELETE FROM kitchen_tools WHERE name = '${escapeString(tool.name)}';
`;
      }
    });
  }
  
  return sql;
}

// Helper function to escape strings for SQL
function escapeString(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/'/g, "''");
}

// Generate SQL for deleting all system items
function generateDeleteAllSql() {
  let sql = '';
  
  // First delete recipe relationships
  sql += `
-- Delete all recipe relationships for system recipes
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM recipes WHERE user_id = 'system');

DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM recipes WHERE user_id = 'system');

-- Delete all system recipes
DELETE FROM recipes WHERE user_id = 'system';

-- Delete all system ingredients
DELETE FROM ingredients WHERE user_id = 'system';

-- Note: We're not deleting kitchen tools as they might be used by user recipes
-- If you want to delete kitchen tools as well, uncomment the following line:
-- DELETE FROM kitchen_tools;
`;
  
  return sql;
}

// Generate SQL for deleting all kitchen tools
function generateDeleteKitchenToolsSql() {
  let sql = '';
  
  // First delete recipe_kitchen_tools relationships
  sql += `
-- Delete all recipe_kitchen_tools relationships
DELETE FROM recipe_kitchen_tools;

-- Delete all kitchen tools
DELETE FROM kitchen_tools;
`;
  
  return sql;
}

// Generate SQL for listing items
function generateListSql(type) {
  let sql = '';
  
  if (type === 'ingredients' || type === 'all') {
    sql += `
-- List all system ingredients
SELECT
  id,
  COALESCE(french_name, name) as name,
  unit,
  type,
  season
FROM ingredients
WHERE user_id = 'system'
ORDER BY type, name;
`;
  }
  
  if (type === 'kitchen_tools' || type === 'all') {
    sql += `
-- List all kitchen tools
SELECT
  id,
  name
FROM kitchen_tools
ORDER BY name;
`;
  }
  
  if (type === 'recipes' || type === 'all') {
    sql += `
-- List all system recipes
SELECT
  id,
  COALESCE(french_name, name) as name,
  description,
  servings,
  season
FROM recipes
WHERE user_id = 'system'
ORDER BY name;
`;
  }
  
  return sql;
}

// Format the results as a table
function formatAsTable(results, type) {
  if (!results || results.length === 0) {
    return `No ${type} found.`;
  }
  
  // Get column names from the first result
  const columns = Object.keys(results[0]);
  
  // Calculate column widths
  const columnWidths = {};
  columns.forEach(col => {
    // Start with the column name length
    columnWidths[col] = col.length;
    
    // Check each row for the maximum value length
    results.forEach(row => {
      const valueStr = row[col] === null ? 'null' : String(row[col]);
      columnWidths[col] = Math.max(columnWidths[col], valueStr.length);
    });
    
    // Add some padding
    columnWidths[col] += 2;
  });
  
  // Create header row
  let table = '\n';
  let headerRow = '';
  let separatorRow = '';
  
  columns.forEach(col => {
    headerRow += col.padEnd(columnWidths[col]);
    separatorRow += '-'.repeat(columnWidths[col]);
  });
  
  table += headerRow + '\n';
  table += separatorRow + '\n';
  
  // Create data rows
  results.forEach(row => {
    let dataRow = '';
    columns.forEach(col => {
      const value = row[col] === null ? 'null' : String(row[col]);
      dataRow += value.padEnd(columnWidths[col]);
    });
    table += dataRow + '\n';
  });
  
  return table;
}

// Generate SQL based on the operation
let sql;
if (operation === 'add') {
  sql = generateAddSql(data);
} else if (operation === 'delete') {
  sql = generateDeleteSql(data);
} else if (operation === 'delete-all') {
  sql = generateDeleteAllSql();
} else if (operation === 'delete-kitchen-tools') {
  sql = generateDeleteKitchenToolsSql();
} else if (operation === 'list') {
  sql = generateListSql(itemType);
}

// Create a temporary SQL file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const tempSqlFile = path.join(process.cwd(), `temp_${operation}_${timestamp}.sql`);
fs.writeFileSync(tempSqlFile, sql);

console.log(`Generated SQL file: ${tempSqlFile}`);
console.log(`Operation: ${operation}`);
console.log(`Environment: ${environment}`);

// Execute the SQL using wrangler
try {
  let wranglerCommand;
  let dbName;
  
  if (environment === 'production') {
    dbName = 'hello-db';
  } else if (environment === 'preview') {
    dbName = 'hello-db-preprod';
  } else {
    // Default to development
    dbName = 'hello-db';
  }
  
  // Get the path to the wrangler.toml file
  const wranglerConfigPath = path.join(__dirname, '..', 'wrangler.toml');
  
  if (environment === 'development') {
    wranglerCommand = `wrangler d1 execute ${dbName} --local --config=${wranglerConfigPath} --file=${tempSqlFile}`;
  } else {
    wranglerCommand = `wrangler d1 execute ${dbName} --config=${wranglerConfigPath} --file=${tempSqlFile}`;
  }
  
  console.log(`Executing command: ${wranglerCommand}`);
  const result = execSync(wranglerCommand, { encoding: 'utf8' });
  
  // For list operation, parse and format the results
  if (operation === 'list') {
    try {
      // Parse the JSON result from wrangler
      const resultObj = JSON.parse(result);
      
      if (outputFormat === 'json') {
        // Output as formatted JSON
        console.log(JSON.stringify(resultObj, null, 2));
      } else {
        // Output as table
        if (itemType === 'all') {
          // Handle multiple result sets
          if (resultObj.length > 0) {
            console.log('\n=== INGREDIENTS ===');
            console.log(formatAsTable(resultObj[0].results, 'ingredients'));
          }
          
          if (resultObj.length > 1) {
            console.log('\n=== KITCHEN TOOLS ===');
            console.log(formatAsTable(resultObj[1].results, 'kitchen tools'));
          }
          
          if (resultObj.length > 2) {
            console.log('\n=== RECIPES ===');
            console.log(formatAsTable(resultObj[2].results, 'recipes'));
          }
        } else {
          // Handle single result set
          if (resultObj.length > 0) {
            console.log(formatAsTable(resultObj[0].results, itemType));
          }
        }
      }
    } catch (parseError) {
      console.error('Error parsing result:', parseError.message);
      console.log('Raw result:');
      console.log(result);
    }
  } else {
    // For add and delete operations, just show the raw result
    console.log('SQL execution result:');
    console.log(result);
    console.log(`${operation === 'add' ? 'Added' : 'Deleted'} items successfully!`);
  }
  
  // Clean up the temporary SQL file
  fs.unlinkSync(tempSqlFile);
  console.log(`Temporary SQL file deleted: ${tempSqlFile}`);
  
} catch (error) {
  console.error('Error executing SQL:', error.message);
  console.log('The SQL file has been kept for debugging purposes.');
  process.exit(1);
}