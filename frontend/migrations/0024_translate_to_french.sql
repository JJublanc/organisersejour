-- Migration to translate all recipes, ingredients, and kitchen tools to French
-- This migration is split into multiple parts due to its size
-- Please use the apply_translations.sh script to apply all parts in the correct order

-- NOTE: This file is just a placeholder. The actual migrations are in:
-- - 0024_translate_to_french_part1.sql: Kitchen tools and spring/summer ingredients
-- - 0024_translate_to_french_part2.sql: Autumn/winter ingredients and common ingredients
-- - 0024_translate_to_french_part3.sql: Recipe names and seasons

-- To apply all migrations, use the provided shell script:
-- ./apply_translations.sh