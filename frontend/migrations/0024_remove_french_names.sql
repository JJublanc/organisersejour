-- Migration to remove French name columns from recipes, ingredients, and kitchen tools
-- and to drop the messages table

-- Remove french_name column from recipes table
ALTER TABLE recipes DROP COLUMN french_name;

-- Remove french_name column from ingredients table
ALTER TABLE ingredients DROP COLUMN french_name;

-- Remove french_name column from kitchen_tools table
ALTER TABLE kitchen_tools DROP COLUMN french_name;

-- Drop messages table
DROP TABLE IF EXISTS messages;