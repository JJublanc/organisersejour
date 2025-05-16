#!/bin/bash

# Script to apply the seasonal recipes migrations
# This script executes each migration part separately and checks for errors

echo "Applying seasonal recipes migrations..."

# Function to execute a migration and check for errors
execute_migration() {
  local file=$1
  echo "Applying migration: $file"
  npx wrangler d1 execute DB --local --file=migrations/$file
  
  if [ $? -ne 0 ]; then
    echo "Error applying migration: $file"
    exit 1
  fi
  
  echo "Migration applied successfully: $file"
}

# Apply migrations in order
execute_migration "0022_add_seasonal_recipes_part1.sql"
execute_migration "0022_add_seasonal_recipes_part2.sql"
execute_migration "0022_add_seasonal_recipes_part3.sql"
execute_migration "0022_add_seasonal_recipes_part4.sql"
execute_migration "0022_add_seasonal_recipes_part5.sql"

echo "All seasonal recipes migrations applied successfully!"