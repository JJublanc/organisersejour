#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name equivalent to __dirname in CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, '../migrations');

// Function to check if a migration file contains schema-altering commands
function isSchemaMigration(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8').toUpperCase();
        // Look for common schema-altering keywords (case-insensitive)
        const schemaKeywords = [
            'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
            'CREATE INDEX', 'DROP INDEX',
            'CREATE SEQUENCE', 'ALTER SEQUENCE', 'DROP SEQUENCE',
            'CREATE TYPE', 'ALTER TYPE', 'DROP TYPE',
            'CREATE VIEW', 'ALTER VIEW', 'DROP VIEW'
        ];
        return schemaKeywords.some(keyword => content.includes(keyword));
    } catch (error) {
        console.error(`Error reading migration file ${filePath}: ${error.message}`);
        return false; // Assume not a schema migration if file cannot be read
    }
}

async function applyMigrations(dbUrlEnvVarName) {
    const dbUrl = process.env[dbUrlEnvVarName];
    const dbPassword = process.env.NEON_PASSWORD;

    if (!dbUrl) {
        console.error(`Error: Environment variable ${dbUrlEnvVarName} is not set.`);
        process.exit(1);
    }
    if (!dbPassword) {
        console.error('Error: Environment variable NEON_PASSWORD is not set.');
        process.exit(1);
    }

    console.log(`Applying migrations to database specified by ${dbUrlEnvVarName}...`);

    try {
        // 1. Apply the script to create the migrations table if it doesn't exist
        const createTableScript = path.join(migrationsDir, '0000_create_migrations_table.sql');
        console.log(`Applying ${createTableScript}...`);
        execSync(`PGPASSWORD=${dbPassword} psql ${dbUrl} -f ${createTableScript}`, { stdio: 'inherit' });
        console.log(`${createTableScript} applied successfully.`);

        // 2. Get list of applied migrations
        console.log('Fetching applied migrations...');
        const appliedMigrationsOutput = execSync(`PGPASSWORD=${dbPassword} psql ${dbUrl} -c "SELECT name FROM applied_migrations ORDER BY name;"`, { encoding: 'utf8' });
        const appliedMigrations = appliedMigrationsOutput
            .split('\n')
            .slice(2, -3) // Remove header, separator, and footer lines from psql output
            .map(line => line.trim())
            .filter(line => line.length > 0);

        console.log('Applied migrations:', appliedMigrations);

        // 3. Get list of all migration files
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql') && file !== '0000_create_migrations_table.sql')
            .sort();

        console.log('Found migration files:', migrationFiles);

        // 4. Apply pending schema-altering migrations
        for (const file of migrationFiles) {
            const filePath = path.join(migrationsDir, file);
            if (isSchemaMigration(filePath)) {
                if (appliedMigrations.includes(file)) {
                    console.log(`Schema migration ${file} already applied. Skipping.`);
                } else {
                    console.log(`Applying schema migration ${file}...`);
                    execSync(`PGPASSWORD=${dbPassword} psql ${dbUrl} -f ${filePath}`, { stdio: 'inherit' });
                    execSync(`PGPASSWORD=${dbPassword} psql ${dbUrl} -c "INSERT INTO applied_migrations (name) VALUES ('${file}')"`, { stdio: 'inherit' });
                    console.log(`Schema migration ${file} applied and recorded.`);
                }
            } else {
                console.log(`Migration ${file} does not appear to be a schema-altering migration. Skipping.`);
            }
        }

        console.log('All pending schema migrations processed.');

    } catch (error) {
        console.error('Error applying migrations:', error.message);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Usage: node apply-neon-migrations.js <DB_URL_ENV_VAR_NAME>');
    process.exit(1);
}

const dbUrlEnvVarName = args[0];
applyMigrations(dbUrlEnvVarName);