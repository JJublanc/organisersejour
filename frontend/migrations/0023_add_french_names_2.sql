-- Migration to add French name columns to recipes, ingredients, and kitchen tools

-- Add french_name column to recipes table
ALTER TABLE recipes ADD COLUMN french_name TEXT;

-- Add french_name column to ingredients table
ALTER TABLE ingredients ADD COLUMN french_name TEXT;

-- Add french_name column to kitchen_tools table
ALTER TABLE kitchen_tools ADD COLUMN french_name TEXT;