#!/bin/bash

# Script to clean up old migration files that are no longer needed

echo "Cleaning up old migration files..."

# Create a backup directory
mkdir -p backup_migrations

# Move old migration files to backup directory
mv frontend/migrations/0024_translate_to_french.sql backup_migrations/ 2>/dev/null || true
mv frontend/migrations/0024_translate_to_french_part1.sql backup_migrations/ 2>/dev/null || true
mv frontend/migrations/0024_translate_to_french_part2.sql backup_migrations/ 2>/dev/null || true
mv frontend/migrations/0024_translate_to_french_part3.sql backup_migrations/ 2>/dev/null || true

echo "Old migration files have been moved to backup_migrations directory."
echo "You can now run the apply_translations.sh script to apply the new migrations."