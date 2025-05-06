
-- Check if recipe already exists and delete its relationships
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM recipes WHERE name = 'Panais à la mode winter' AND user_id = 'system');

DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM recipes WHERE name = 'Panais à la mode winter' AND user_id = 'system');

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Panais à la mode winter' AND user_id = 'system';

-- Insert recipe: Panais à la mode winter
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Panais à la mode winter',
  'Une préparation savoureuse à base de panais pour la saison winter.',
  13,
  18,
  '1. Préparer les panais.
2. Cuire ou assembler selon la recette.
3. Assaisonner et servir chaud ou froid.',
  4,
  'winter',
  'system'
);

-- Get the ID of the newly inserted recipe
SELECT last_insert_rowid() AS recipe_id;

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES ((SELECT id FROM recipes WHERE name = 'Panais à la mode winter' AND user_id = 'system'), 838, 143);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES ((SELECT id FROM recipes WHERE name = 'Panais à la mode winter' AND user_id = 'system'), 7, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES ((SELECT id FROM recipes WHERE name = 'Panais à la mode winter' AND user_id = 'system'), 6, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES ((SELECT id FROM recipes WHERE name = 'Panais à la mode winter' AND user_id = 'system'), 753, 1);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) 
VALUES ((SELECT id FROM recipes WHERE name = 'Panais à la mode winter' AND user_id = 'system'), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) 
VALUES ((SELECT id FROM recipes WHERE name = 'Panais à la mode winter' AND user_id = 'system'), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) 
VALUES ((SELECT id FROM recipes WHERE name = 'Panais à la mode winter' AND user_id = 'system'), 89);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) 
VALUES ((SELECT id FROM recipes WHERE name = 'Panais à la mode winter' AND user_id = 'system'), 90);
