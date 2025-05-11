#!/bin/bash

# Script to apply the translation migrations
# This script executes each translation part separately

echo "Applying translation migrations..."

# Apply the migration to add French name columns
echo "Adding French name columns to tables..."
npx wrangler d1 execute DB --local --file=migrations/0023_add_french_names_2.sql

# Apply part 1: Kitchen tools and spring/summer ingredients
echo "Populating French names for kitchen tools and spring/summer ingredients..."
npx wrangler d1 execute DB --local --file=migrations/0025_populate_french_names_part1.sql

# Apply part 2: Autumn/winter ingredients and common ingredients
echo "Populating French names for autumn/winter ingredients and common ingredients..."
npx wrangler d1 execute DB --local --file=migrations/0025_populate_french_names_part2.sql

# Apply part 3: Recipe names and seasons
echo "Populating French names for recipe names and seasons..."
npx wrangler d1 execute DB --local --file=migrations/0025_populate_french_names_part3.sql

echo "All translation migrations applied successfully!"