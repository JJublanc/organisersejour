#!/bin/bash

# Script to apply the seasonal recipes migrations
# This script executes each migration part separately

echo "Applying seasonal recipes migrations..."

# Apply part 1: Kitchen tools and seasonal ingredients
echo "Applying part 1: Kitchen tools and seasonal ingredients"
npx wrangler d1 execute DB --local --file=migrations/0022_add_seasonal_recipes_part1.sql

# Apply part 2: Spring recipes
echo "Applying part 2: Spring recipes"
npx wrangler d1 execute DB --local --file=migrations/0022_add_seasonal_recipes_part2.sql

# Apply part 3: Summer recipes
echo "Applying part 3: Summer recipes"
npx wrangler d1 execute DB --local --file=migrations/0022_add_seasonal_recipes_part3.sql

# Apply part 4: Autumn recipes
echo "Applying part 4: Autumn recipes"
npx wrangler d1 execute DB --local --file=migrations/0022_add_seasonal_recipes_part4.sql

# Apply part 5: Winter recipes
echo "Applying part 5: Winter recipes"
npx wrangler d1 execute DB --local --file=migrations/0022_add_seasonal_recipes_part5.sql

echo "All seasonal recipes migrations applied successfully!"