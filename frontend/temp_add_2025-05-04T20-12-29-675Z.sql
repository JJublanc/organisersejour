
-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Velouté de Potiron aux Épices' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Velouté de Potiron aux Épices' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Velouté de Potiron aux Épices' AND user_id = 'system';

-- Insert recipe: Velouté de Potiron aux Épices
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Velouté de Potiron aux Épices',
  'Soupe onctueuse et réconfortante, parfaite pour les soirées fraîches d''automne',
  20,
  40,
  '1. Éplucher et couper le potiron en cubes.
2. Émincer l''oignon et hacher l''ail finement.
3. Dans une cocotte, faire revenir l''oignon dans un peu d''huile jusqu''à ce qu''il soit translucide.
4. Ajouter l''ail et faire revenir 1 minute.
5. Ajouter les cubes de potiron et faire revenir 5 minutes.
6. Verser le bouillon chaud et porter à ébullition.
7. Réduire le feu et laisser mijoter 30 minutes jusqu''à ce que le potiron soit tendre.
8. Mixer le tout jusqu''à obtenir une texture lisse.
9. Ajouter la crème fraîche, le sel, le poivre et une pincée de muscade.
10. Servir chaud avec des croûtons et un filet d''huile d''olive.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 291, 1000);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 448, 100);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 96);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 123);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Gratin de Chou-Fleur au Comté' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Gratin de Chou-Fleur au Comté' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Gratin de Chou-Fleur au Comté' AND user_id = 'system';

-- Insert recipe: Gratin de Chou-Fleur au Comté
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Gratin de Chou-Fleur au Comté',
  'Plat réconfortant à base de légumes d''automne, gratiné au four',
  25,
  40,
  '1. Préchauffer le four à 180°C.
2. Laver et détailler le chou-fleur en petits bouquets.
3. Faire cuire le chou-fleur à la vapeur pendant 15 minutes jusqu''à ce qu''il soit tendre mais encore ferme.
4. Pendant ce temps, préparer la béchamel : faire fondre le beurre dans une casserole, ajouter la farine et remuer pour former un roux. Verser progressivement le lait chaud tout en fouettant. Cuire jusqu''à épaississement.
5. Assaisonner la béchamel avec du sel, du poivre et une pincée de muscade.
6. Ajouter la moitié du comté râpé à la béchamel et mélanger.
7. Dans un plat à gratin, disposer le chou-fleur et verser la béchamel dessus.
8. Saupoudrer du reste de comté râpé et enfourner pour 25 minutes jusqu''à ce que le dessus soit doré.
9. Servir chaud.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 46, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 423, 500);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 430, 50);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 456, 150);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 90);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Poulet Rôti aux Herbes d''Automne' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Poulet Rôti aux Herbes d''Automne' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Poulet Rôti aux Herbes d''Automne' AND user_id = 'system';

-- Insert recipe: Poulet Rôti aux Herbes d'Automne
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Poulet Rôti aux Herbes d''Automne',
  'Plat familial réconfortant avec des légumes de saison',
  25,
  75,
  '1. Préchauffer le four à 190°C.
2. Préparer le poulet : le rincer, le sécher et le frotter avec de l''huile d''olive, du sel et du poivre.
3. Farcir la cavité avec quelques branches de thym, de romarin et une tête d''ail coupée en deux.
4. Éplucher et couper en gros morceaux les carottes, les pommes de terre et les oignons.
5. Disposer les légumes dans un grand plat à four et les arroser d''huile d''olive. Saler et poivrer.
6. Placer le poulet sur les légumes.
7. Enfourner pour 1h15, en arrosant régulièrement le poulet avec son jus de cuisson.
8. Vérifier la cuisson en piquant la cuisse : le jus doit être clair.
9. Laisser reposer 10 minutes avant de découper et servir.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 10, 300);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 40, 500);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 124, 1800);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 45);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 8);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 4);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 316, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 346, 2);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Risotto aux Champignons des Bois' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Risotto aux Champignons des Bois' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Risotto aux Champignons des Bois' AND user_id = 'system';

-- Insert recipe: Risotto aux Champignons des Bois
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Risotto aux Champignons des Bois',
  'Plat crémeux à base de riz et de champignons sauvages d''automne',
  15,
  30,
  '1. Nettoyer soigneusement les champignons et les couper en morceaux.
2. Dans une poêle, faire revenir les champignons dans un peu d''huile d''olive jusqu''à ce qu''ils soient dorés. Réserver.
3. Dans une casserole, faire revenir l''oignon émincé dans l''huile d''olive jusqu''à ce qu''il soit translucide.
4. Ajouter le riz et le faire nacrer pendant 2 minutes en remuant constamment.
5. Verser le vin blanc et laisser évaporer.
6. Ajouter le bouillon chaud, louche par louche, en attendant qu''il soit absorbé avant d''en ajouter une nouvelle.
7. Après environ 18 minutes, le riz doit être al dente. Ajouter les champignons réservés.
8. Retirer du feu, ajouter le beurre et le parmesan râpé. Mélanger vigoureusement.
9. Couvrir et laisser reposer 2 minutes.
10. Servir immédiatement, parsemé de persil haché.',
  4,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 291, 1000);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 322, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 364, 320);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 430, 40);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 466, 50);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 483, 400);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 90);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Tarte aux Pommes et Caramel' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Tarte aux Pommes et Caramel' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Tarte aux Pommes et Caramel' AND user_id = 'system';

-- Insert recipe: Tarte aux Pommes et Caramel
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Tarte aux Pommes et Caramel',
  'Dessert classique d''automne, avec des pommes caramélisées',
  30,
  45,
  '1. Préchauffer le four à 180°C.
2. Étaler la pâte brisée dans un moule à tarte et la piquer à la fourchette.
3. Éplucher et couper les pommes en fines tranches.
4. Dans une poêle, faire fondre le beurre avec le sucre jusqu''à obtenir un caramel léger.
5. Ajouter les pommes et les faire caraméliser pendant 10 minutes.
6. Disposer les pommes caramélisées sur le fond de tarte.
7. Dans un bol, mélanger les œufs, la crème fraîche et la vanille.
8. Verser ce mélange sur les pommes.
9. Enfourner pour 35-40 minutes jusqu''à ce que la tarte soit dorée.
10. Laisser tiédir avant de servir.',
  8,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 64, 1000);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 430, 100);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 448, 200);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Soupe à la Citrouille et Lentilles Corail' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Soupe à la Citrouille et Lentilles Corail' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Soupe à la Citrouille et Lentilles Corail' AND user_id = 'system';

-- Insert recipe: Soupe à la Citrouille et Lentilles Corail
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Soupe à la Citrouille et Lentilles Corail',
  'Soupe automnale riche en saveurs et en protéines',
  20,
  35,
  '1. Éplucher et couper la citrouille en cubes.
2. Émincer l''oignon et l''ail.
3. Dans une grande casserole, faire revenir l''oignon dans l''huile d''olive jusqu''à ce qu''il soit translucide.
4. Ajouter l''ail et faire revenir 1 minute.
5. Ajouter les cubes de citrouille et faire revenir 5 minutes.
6. Ajouter les lentilles corail rincées, le cumin, le paprika et le bouillon.
7. Porter à ébullition puis réduire le feu et laisser mijoter 25 minutes jusqu''à ce que les lentilles et la citrouille soient tendres.
8. Mixer le tout jusqu''à obtenir une texture lisse.
9. Ajouter le lait de coco, saler et poivrer.
10. Servir chaud, parsemé de coriandre fraîche et de graines de courge torréfiées.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 291, 1000);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 334, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 400, 250);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 90);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 96);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Crumble aux Pommes et Cannelle' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Crumble aux Pommes et Cannelle' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Crumble aux Pommes et Cannelle' AND user_id = 'system';

-- Insert recipe: Crumble aux Pommes et Cannelle
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Crumble aux Pommes et Cannelle',
  'Dessert réconfortant aux saveurs automnales',
  20,
  40,
  '1. Préchauffer le four à 180°C.
2. Éplucher et couper les pommes en morceaux.
3. Dans une poêle, faire revenir les pommes avec le sucre, la cannelle et un peu d''eau pendant 10 minutes jusqu''à ce qu''elles soient tendres mais encore fermes.
4. Préparer la pâte à crumble : dans un saladier, mélanger du bout des doigts la farine, le beurre froid coupé en dés et le sucre jusqu''à obtenir une texture sableuse.
5. Verser les pommes dans un plat à gratin.
6. Répartir la pâte à crumble sur les pommes.
7. Enfourner pour 30 minutes jusqu''à ce que le dessus soit doré.
8. Servir tiède, éventuellement avec une boule de glace à la vanille.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 64, 1000);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 123, 150);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 430, 100);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 86);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Bœuf Bourguignon' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Bœuf Bourguignon' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Bœuf Bourguignon' AND user_id = 'system';

-- Insert recipe: Bœuf Bourguignon
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Bœuf Bourguignon',
  'Plat mijoté traditionnel français, parfait pour les soirées fraîches',
  30,
  180,
  '1. Couper le bœuf en cubes de 3-4 cm.
2. Dans une cocotte, faire chauffer l''huile et y faire dorer les morceaux de viande par petites quantités.
3. Réserver la viande et faire revenir les oignons et les carottes coupées en rondelles.
4. Saupoudrer de farine et remuer.
5. Remettre la viande, ajouter l''ail écrasé, le bouquet garni, le sel et le poivre.
6. Verser le vin rouge et le bouillon jusqu''à couvrir la viande.
7. Porter à ébullition, puis réduire le feu et laisser mijoter à couvert pendant 2h30.
8. Pendant ce temps, faire revenir les champignons et les lardons séparément.
9. 30 minutes avant la fin de la cuisson, ajouter les champignons et les lardons.
10. Servir chaud, accompagné de pommes de terre vapeur ou de pâtes.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 10, 300);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 40, 500);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 123, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 130, 1500);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 8);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 4);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 291, 500);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 310, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 346, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 483, 250);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 123);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Tarte Tatin aux Poires' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Tarte Tatin aux Poires' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Tarte Tatin aux Poires' AND user_id = 'system';

-- Insert recipe: Tarte Tatin aux Poires
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Tarte Tatin aux Poires',
  'Variation automnale de la célèbre tarte renversée',
  25,
  45,
  '1. Préchauffer le four à 180°C.
2. Éplucher les poires, les couper en quartiers et retirer le cœur.
3. Dans une poêle allant au four, faire fondre le beurre avec le sucre jusqu''à obtenir un caramel doré.
4. Disposer les quartiers de poires dans le caramel, face bombée contre le fond.
5. Faire caraméliser à feu moyen pendant 15 minutes.
6. Retirer du feu et laisser refroidir légèrement.
7. Couvrir avec la pâte feuilletée en rentrant bien les bords à l''intérieur de la poêle.
8. Piquer la pâte avec une fourchette.
9. Enfourner pour 30 minutes jusqu''à ce que la pâte soit dorée.
10. Laisser tiédir 10 minutes, puis retourner délicatement sur un plat de service.
11. Servir tiède, éventuellement avec une boule de glace à la vanille ou de la crème fraîche.',
  8,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 70, 8);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 430, 100);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Salade Tiède de Lentilles au Bacon' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Salade Tiède de Lentilles au Bacon' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Salade Tiède de Lentilles au Bacon' AND user_id = 'system';

-- Insert recipe: Salade Tiède de Lentilles au Bacon
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Salade Tiède de Lentilles au Bacon',
  'Plat complet et réconfortant, idéal pour un déjeuner d''automne',
  15,
  30,
  '1. Rincer les lentilles et les faire cuire dans un grand volume d''eau salée pendant 25-30 minutes jusqu''à ce qu''elles soient tendres mais encore fermes.
2. Pendant ce temps, couper le bacon en lardons et les faire revenir dans une poêle sans matière grasse jusqu''à ce qu''ils soient croustillants.
3. Émincer finement l''oignon rouge et le faire revenir dans la graisse du bacon.
4. Préparer la vinaigrette en mélangeant l''huile d''olive, le vinaigre balsamique, la moutarde, le sel et le poivre.
5. Égoutter les lentilles et les mettre dans un saladier.
6. Ajouter les lardons, l''oignon, et la vinaigrette. Mélanger délicatement.
7. Parsemer de persil frais haché.
8. Servir tiède.',
  4,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 45);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 250, 15);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 256, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 322, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 400, 300);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 86);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 90);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Poêlée de Champignons à la Crème' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Poêlée de Champignons à la Crème' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Poêlée de Champignons à la Crème' AND user_id = 'system';

-- Insert recipe: Poêlée de Champignons à la Crème
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Poêlée de Champignons à la Crème',
  'Accompagnement savoureux à base de champignons frais',
  15,
  20,
  '1. Nettoyer soigneusement les champignons et les couper en quartiers s''ils sont gros.
2. Émincer finement l''échalote et hacher l''ail.
3. Dans une poêle, faire fondre le beurre et y faire revenir l''échalote jusqu''à ce qu''elle soit translucide.
4. Ajouter l''ail et faire revenir 30 secondes.
5. Ajouter les champignons et les faire sauter à feu vif pendant 5 minutes jusqu''à ce qu''ils rendent leur eau.
6. Poursuivre la cuisson jusqu''à évaporation de l''eau.
7. Verser la crème fraîche, saler, poivrer et ajouter le persil haché.
8. Laisser réduire légèrement la sauce.
9. Servir chaud, accompagné de tranches de pain grillé.',
  4,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 20);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 322, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 430, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 448, 200);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 483, 500);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Gratin Dauphinois' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Gratin Dauphinois' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Gratin Dauphinois' AND user_id = 'system';

-- Insert recipe: Gratin Dauphinois
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Gratin Dauphinois',
  'Plat traditionnel à base de pommes de terre et de crème',
  20,
  60,
  '1. Préchauffer le four à 180°C.
2. Éplucher et couper les pommes de terre en fines rondelles.
3. Frotter un plat à gratin avec une gousse d''ail coupée en deux.
4. Disposer les pommes de terre en couches dans le plat.
5. Dans un bol, mélanger la crème fraîche, le lait, la noix de muscade, le sel et le poivre.
6. Verser ce mélange sur les pommes de terre.
7. Enfourner pour 1 heure jusqu''à ce que les pommes de terre soient tendres et que le dessus soit doré.
8. Laisser reposer 10 minutes avant de servir.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 40, 1000);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 423, 250);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 448, 250);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Chili Con Carne' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Chili Con Carne' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Chili Con Carne' AND user_id = 'system';

-- Insert recipe: Chili Con Carne
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Chili Con Carne',
  'Plat mijoté épicé à base de viande et de haricots rouges',
  20,
  60,
  '1. Émincer l''oignon et hacher l''ail finement.
2. Dans une cocotte, faire chauffer l''huile d''olive et y faire revenir l''oignon jusqu''à ce qu''il soit translucide.
3. Ajouter l''ail et faire revenir 1 minute.
4. Ajouter la viande hachée et la faire dorer en l''émiettant à la spatule.
5. Ajouter le cumin, le paprika, le piment en poudre, le sel et le poivre.
6. Ajouter les tomates concassées, le concentré de tomate et le bouillon.
7. Porter à ébullition, puis réduire le feu et laisser mijoter à couvert pendant 30 minutes.
8. Ajouter les haricots rouges égouttés et poursuivre la cuisson 15 minutes.
9. Servir chaud, accompagné de riz et garni de coriandre fraîche et de crème fraîche.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 4, 400);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 130, 500);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 291, 250);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 334, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 364, 300);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 412, 500);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 448, 100);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 123);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Soupe à l''Oignon Gratinée' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Soupe à l''Oignon Gratinée' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Soupe à l''Oignon Gratinée' AND user_id = 'system';

-- Insert recipe: Soupe à l'Oignon Gratinée
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Soupe à l''Oignon Gratinée',
  'Soupe traditionnelle française, parfaite pour se réchauffer',
  20,
  60,
  '1. Éplucher et émincer finement les oignons.
2. Dans une cocotte, faire fondre le beurre et y faire revenir les oignons à feu doux pendant 30 minutes jusqu''à ce qu''ils soient bien dorés.
3. Saupoudrer de farine, mélanger et laisser cuire 2 minutes.
4. Verser le bouillon chaud, ajouter le thym et la feuille de laurier.
5. Saler et poivrer.
6. Laisser mijoter à couvert pendant 30 minutes.
7. Préchauffer le grill du four.
8. Répartir la soupe dans des bols allant au four.
9. Déposer une tranche de pain grillé sur chaque bol et couvrir généreusement de gruyère râpé.
10. Passer sous le grill jusqu''à ce que le fromage soit doré et gratiné.
11. Servir immédiatement.',
  4,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 6);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 123, 20);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 291, 1000);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 310, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 346, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 376, 4);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 430, 50);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 456, 200);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 123);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Tajine de Poulet aux Olives et Citron Confit' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Tajine de Poulet aux Olives et Citron Confit' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Tajine de Poulet aux Olives et Citron Confit' AND user_id = 'system';

-- Insert recipe: Tajine de Poulet aux Olives et Citron Confit
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Tajine de Poulet aux Olives et Citron Confit',
  'Plat mijoté aux saveurs orientales, parfait pour les repas d''automne en famille',
  30,
  90,
  '1. Couper le poulet en morceaux.
2. Dans une cocotte, faire chauffer l''huile d''olive et y faire dorer les morceaux de poulet sur toutes les faces.
3. Ajouter les oignons émincés et faire revenir jusqu''à ce qu''ils soient translucides.
4. Ajouter l''ail écrasé, le gingembre râpé, le cumin, le paprika et le safran. Mélanger et faire revenir 1 minute.
5. Verser le bouillon chaud, saler et poivrer.
6. Couvrir et laisser mijoter à feu doux pendant 45 minutes.
7. Ajouter les olives vertes et le citron confit coupé en morceaux.
8. Poursuivre la cuisson 30 minutes.
9. Parsemer de coriandre fraîche avant de servir.
10. Accompagner de semoule.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 124, 1200);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 45);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 291, 500);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 334, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 382, 300);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 123);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Gâteau aux Noix et au Miel' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Gâteau aux Noix et au Miel' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Gâteau aux Noix et au Miel' AND user_id = 'system';

-- Insert recipe: Gâteau aux Noix et au Miel
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Gâteau aux Noix et au Miel',
  'Dessert moelleux aux saveurs automnales',
  20,
  40,
  '1. Préchauffer le four à 180°C.
2. Beurrer et fariner un moule à gâteau.
3. Dans un saladier, fouetter les œufs avec le sucre jusqu''à ce que le mélange blanchisse.
4. Ajouter le miel et mélanger.
5. Incorporer la farine tamisée avec la levure chimique.
6. Ajouter les noix concassées et mélanger délicatement.
7. Verser la pâte dans le moule.
8. Enfourner pour 35-40 minutes jusqu''à ce que le gâteau soit doré et qu''un couteau planté au centre en ressorte propre.
9. Laisser refroidir avant de démouler.
10. Servir nature ou avec une boule de glace à la vanille.',
  8,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 123, 100);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 430, 50);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 86);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 91);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Potimarron Farci au Quinoa et Légumes d''Automne' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Potimarron Farci au Quinoa et Légumes d''Automne' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Potimarron Farci au Quinoa et Légumes d''Automne' AND user_id = 'system';

-- Insert recipe: Potimarron Farci au Quinoa et Légumes d'Automne
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Potimarron Farci au Quinoa et Légumes d''Automne',
  'Plat végétarien complet et savoureux',
  30,
  50,
  '1. Préchauffer le four à 180°C.
2. Couper le chapeau du potimarron et retirer les graines.
3. Badigeonner l''intérieur du potimarron d''huile d''olive, saler et poivrer.
4. Enfourner le potimarron et son chapeau pendant 30 minutes.
5. Pendant ce temps, rincer le quinoa et le faire cuire dans 2 fois son volume d''eau salée pendant 15 minutes.
6. Dans une poêle, faire revenir l''oignon émincé dans un peu d''huile d''olive.
7. Ajouter les champignons coupés en morceaux et faire revenir 5 minutes.
8. Ajouter les épinards et laisser fondre.
9. Mélanger le quinoa cuit avec les légumes, les cranberries séchées, les noix concassées, le sel, le poivre et les herbes fraîches.
10. Farcir le potimarron avec ce mélange.
11. Saupoudrer de fromage râpé et remettre au four pour 15 minutes.
12. Servir chaud, avec le chapeau du potimarron à côté.',
  4,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 388, 200);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 456, 100);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 483, 200);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Tarte aux Champignons et Lardons' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Tarte aux Champignons et Lardons' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Tarte aux Champignons et Lardons' AND user_id = 'system';

-- Insert recipe: Tarte aux Champignons et Lardons
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Tarte aux Champignons et Lardons',
  'Tarte salée automnale, parfaite pour un dîner léger',
  25,
  35,
  '1. Préchauffer le four à 180°C.
2. Étaler la pâte brisée dans un moule à tarte et la piquer à la fourchette.
3. Faire revenir les lardons dans une poêle sans matière grasse jusqu''à ce qu''ils soient dorés.
4. Ajouter les champignons émincés et faire revenir jusqu''à évaporation de l''eau.
5. Ajouter l''échalote finement émincée et faire revenir 2 minutes.
6. Répartir ce mélange sur le fond de tarte.
7. Dans un bol, battre les œufs avec la crème fraîche, le sel, le poivre et la muscade.
8. Verser cet appareil sur la garniture.
9. Saupoudrer de gruyère râpé.
10. Enfourner pour 30-35 minutes jusqu''à ce que la tarte soit dorée.
11. Servir tiède, accompagnée d''une salade verte.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 448, 200);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 456, 100);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 483, 400);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Crème de Potiron au Lait de Coco' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Crème de Potiron au Lait de Coco' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Crème de Potiron au Lait de Coco' AND user_id = 'system';

-- Insert recipe: Crème de Potiron au Lait de Coco
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Crème de Potiron au Lait de Coco',
  'Soupe onctueuse aux saveurs douces et exotiques',
  20,
  30,
  '1. Éplucher et couper le potiron en cubes.
2. Émincer l''oignon et hacher l''ail finement.
3. Dans une cocotte, faire revenir l''oignon dans un peu d''huile jusqu''à ce qu''il soit translucide.
4. Ajouter l''ail et faire revenir 1 minute.
5. Ajouter les cubes de potiron et faire revenir 5 minutes.
6. Verser le bouillon chaud et porter à ébullition.
7. Réduire le feu et laisser mijoter 20 minutes jusqu''à ce que le potiron soit tendre.
8. Mixer le tout jusqu''à obtenir une texture lisse.
9. Ajouter le lait de coco, le curry, le sel et le poivre.
10. Réchauffer doucement sans faire bouillir.
11. Servir chaud, parsemé de coriandre fraîche et de quelques gouttes d''huile de sésame.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 291, 1000);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 334, 10);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 96);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 123);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Compote de Pommes à la Cannelle' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Compote de Pommes à la Cannelle' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Compote de Pommes à la Cannelle' AND user_id = 'system';

-- Insert recipe: Compote de Pommes à la Cannelle
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Compote de Pommes à la Cannelle',
  'Dessert simple et réconfortant, parfait pour les goûters d''automne',
  15,
  25,
  '1. Éplucher et couper les pommes en morceaux.
2. Dans une casserole, mettre les pommes avec un peu d''eau, le sucre et la cannelle.
3. Couvrir et faire cuire à feu doux pendant 20-25 minutes en remuant de temps en temps.
4. Selon la texture désirée, écraser grossièrement à la fourchette ou mixer pour une compote lisse.
5. Laisser refroidir avant de servir.
6. Se conserve au réfrigérateur pendant plusieurs jours.',
  6,
  'autumn',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 64, 1000);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 90);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Salade Niçoise Estivale' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Salade Niçoise Estivale' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Salade Niçoise Estivale' AND user_id = 'system';

-- Insert recipe: Salade Niçoise Estivale
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Salade Niçoise Estivale',
  'Une salade fraîche et colorée, parfaite pour les chaudes journées d''été',
  20,
  15,
  '1. Faire cuire les pommes de terre à l''eau salée pendant 15 minutes, puis les laisser refroidir et les couper en rondelles.
2. Cuire les œufs durs pendant 9 minutes, les refroidir, les écaler et les couper en quartiers.
3. Laver et couper les tomates en quartiers.
4. Laver et égoutter les radis, puis les couper en rondelles.
5. Égoutter le thon et l''émietter.
6. Dans un saladier, disposer les feuilles de salade, puis ajouter harmonieusement tous les ingrédients.
7. Préparer la vinaigrette en mélangeant l''huile d''olive, le vinaigre, la moutarde, le sel et le poivre.
8. Arroser la salade de vinaigrette juste avant de servir.',
  4,
  'summer',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 4, 400);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 40, 300);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 57, 100);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 189, 200);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 45);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 250, 15);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 256, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 86);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 94);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Gazpacho Andalou' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Gazpacho Andalou' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Gazpacho Andalou' AND user_id = 'system';

-- Insert recipe: Gazpacho Andalou
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Gazpacho Andalou',
  'Soupe froide à base de tomates et légumes frais, idéale pour se rafraîchir en été',
  20,
  NULL,
  '1. Laver tous les légumes. Épépiner le poivron et le concasser grossièrement.
2. Couper les tomates en quartiers et l''oignon en morceaux.
3. Éplucher le concombre et le couper en morceaux.
4. Mettre tous les légumes dans un blender avec l''ail écrasé, l''huile d''olive, le vinaigre, le sel et le poivre.
5. Mixer jusqu''à obtenir une soupe lisse.
6. Réfrigérer au moins 2 heures avant de servir.
7. Au moment de servir, garnir de petits dés de concombre et de poivron, et d''un filet d''huile d''olive.',
  6,
  'summer',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 4, 1000);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 22, 200);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 60);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 250, 20);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 96);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Ratatouille Provençale' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Ratatouille Provençale' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Ratatouille Provençale' AND user_id = 'system';

-- Insert recipe: Ratatouille Provençale
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Ratatouille Provençale',
  'Un plat emblématique du sud de la France, parfait pour utiliser les légumes d''été',
  30,
  60,
  '1. Laver tous les légumes. Couper les aubergines, les courgettes et les poivrons en cubes de taille moyenne.
2. Émincer l''oignon et hacher l''ail finement.
3. Dans une grande cocotte, faire chauffer l''huile d''olive et faire revenir l''oignon jusqu''à ce qu''il soit translucide.
4. Ajouter l''ail et faire revenir 1 minute.
5. Ajouter les aubergines et les faire dorer pendant 5 minutes.
6. Ajouter les courgettes et les poivrons, puis faire revenir 5 minutes supplémentaires.
7. Ajouter les tomates coupées en morceaux, le thym, le laurier, le sel et le poivre.
8. Couvrir et laisser mijoter à feu doux pendant 45 minutes en remuant de temps en temps.
9. Servir chaud ou froid, parsemé de basilic frais.',
  6,
  'summer',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 4, 800);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 16, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 28, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 22, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 60);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 310, 4);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 346, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 304, 10);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 123);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Taboulé à la Menthe' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Taboulé à la Menthe' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Taboulé à la Menthe' AND user_id = 'system';

-- Insert recipe: Taboulé à la Menthe
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Taboulé à la Menthe',
  'Salade fraîche à base de semoule, parfaite pour accompagner les grillades d''été',
  20,
  NULL,
  '1. Mettre la semoule dans un saladier et verser de l''eau bouillante jusqu''à la recouvrir. Couvrir et laisser gonfler 5 minutes.
2. Égrainer la semoule à la fourchette et laisser refroidir.
3. Laver et couper les tomates en petits dés.
4. Laver et hacher finement le persil et la menthe.
5. Émincer finement l''oignon.
6. Mélanger tous les ingrédients avec la semoule refroidie.
7. Préparer la vinaigrette en mélangeant l''huile d''olive, le jus de citron, le sel et le poivre.
8. Verser la vinaigrette sur le taboulé et bien mélanger.
9. Réfrigérer au moins 1 heure avant de servir.',
  6,
  'summer',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 382, 250);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 4, 400);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 322, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 340, 20);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 60);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 86);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Papillote de Dorade aux Herbes' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Papillote de Dorade aux Herbes' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Papillote de Dorade aux Herbes' AND user_id = 'system';

-- Insert recipe: Papillote de Dorade aux Herbes
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Papillote de Dorade aux Herbes',
  'Poisson cuit en papillote avec des herbes fraîches, léger et savoureux',
  15,
  20,
  '1. Préchauffer le four à 200°C.
2. Laver et sécher les filets de dorade.
3. Préparer 4 grandes feuilles de papier sulfurisé.
4. Déposer un filet de dorade sur chaque feuille.
5. Arroser d''un filet d''huile d''olive et de jus de citron.
6. Parsemer d''herbes fraîches (persil, coriandre, estragon).
7. Saler et poivrer.
8. Fermer les papillotes en repliant les bords.
9. Enfourner pour 15-20 minutes selon l''épaisseur des filets.
10. Servir immédiatement dans les papillotes.',
  4,
  'summer',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 232, 800);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 40);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 322, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 334, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 358, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Brochettes de Poulet Mariné' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Brochettes de Poulet Mariné' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Brochettes de Poulet Mariné' AND user_id = 'system';

-- Insert recipe: Brochettes de Poulet Mariné
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Brochettes de Poulet Mariné',
  'Brochettes de poulet marinées aux épices, parfaites pour le barbecue',
  20,
  15,
  '1. Couper le poulet en cubes de taille moyenne.
2. Préparer la marinade en mélangeant l''huile d''olive, le jus de citron, l''ail écrasé, le paprika, le cumin, le sel et le poivre.
3. Mettre le poulet dans la marinade et laisser reposer au réfrigérateur pendant au moins 2 heures.
4. Enfiler les morceaux de poulet sur des brochettes en alternant avec des morceaux de poivron et d''oignon.
5. Faire cuire les brochettes au barbecue ou à la poêle pendant environ 15 minutes en les retournant régulièrement.
6. Servir chaud avec une salade ou du riz.',
  4,
  'summer',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 124, 800);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 22, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 60);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 364, 300);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 89);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Salade de Riz au Thon' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Salade de Riz au Thon' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Salade de Riz au Thon' AND user_id = 'system';

-- Insert recipe: Salade de Riz au Thon
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Salade de Riz au Thon',
  'Salade complète à base de riz, thon et légumes frais',
  20,
  15,
  '1. Faire cuire le riz selon les instructions du paquet, puis le laisser refroidir.
2. Égoutter le thon et l''émietter.
3. Laver et couper les tomates en dés.
4. Laver et couper les radis en rondelles.
5. Émincer finement l''oignon.
6. Dans un grand saladier, mélanger le riz refroidi avec le thon, les tomates, les radis et l''oignon.
7. Préparer la vinaigrette en mélangeant l''huile d''olive, le vinaigre, la moutarde, le sel et le poivre.
8. Verser la vinaigrette sur la salade et bien mélanger.
9. Réfrigérer au moins 1 heure avant de servir.',
  4,
  'summer',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 364, 300);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 189, 200);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 4, 300);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 57, 100);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 45);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 250, 15);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 256, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 86);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 90);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Tarte à la Tomate et Moutarde' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Tarte à la Tomate et Moutarde' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Tarte à la Tomate et Moutarde' AND user_id = 'system';

-- Insert recipe: Tarte à la Tomate et Moutarde
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Tarte à la Tomate et Moutarde',
  'Tarte salée estivale à base de tomates fraîches et de moutarde',
  20,
  30,
  '1. Préchauffer le four à 180°C.
2. Étaler la pâte brisée dans un moule à tarte et la piquer à la fourchette.
3. Étaler une fine couche de moutarde sur le fond de tarte.
4. Laver et couper les tomates en rondelles.
5. Disposer les rondelles de tomates sur la moutarde en les faisant légèrement se chevaucher.
6. Saupoudrer d''herbes de Provence, saler et poivrer.
7. Arroser d''un filet d''huile d''olive.
8. Enfourner pour 30 minutes jusqu''à ce que la pâte soit dorée.
9. Laisser tiédir avant de servir, parsemé de basilic frais.',
  6,
  'summer',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 4, 800);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 256, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 30);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 304, 10);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 132);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Melon au Jambon Cru' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Melon au Jambon Cru' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Melon au Jambon Cru' AND user_id = 'system';

-- Insert recipe: Melon au Jambon Cru
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Melon au Jambon Cru',
  'Entrée classique de l''été, simple et rafraîchissante',
  10,
  NULL,
  '1. Couper le melon en deux et retirer les graines.
2. Découper la chair du melon en tranches ou en billes à l''aide d''une cuillère parisienne.
3. Disposer les tranches ou les billes de melon sur un plat de service.
4. Déposer les tranches de jambon cru à côté ou autour du melon.
5. Arroser d''un filet d''huile d''olive et poivrer légèrement.
6. Servir bien frais.',
  4,
  'summer',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 106, 2);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 15);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 2);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);


-- Check if recipe already exists and delete its relationships
WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Salade de Quinoa aux Légumes d''Été' AND user_id = 'system'
)
DELETE FROM recipe_ingredients
WHERE recipe_id IN (SELECT id FROM existing_recipe);

WITH existing_recipe AS (
  SELECT id FROM recipes WHERE name = 'Salade de Quinoa aux Légumes d''Été' AND user_id = 'system'
)
DELETE FROM recipe_kitchen_tools
WHERE recipe_id IN (SELECT id FROM existing_recipe);

-- Delete the existing recipe if it exists
DELETE FROM recipes
WHERE name = 'Salade de Quinoa aux Légumes d''Été' AND user_id = 'system';

-- Insert recipe: Salade de Quinoa aux Légumes d'Été
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES (
  'Salade de Quinoa aux Légumes d''Été',
  'Salade saine et complète à base de quinoa et légumes frais',
  20,
  15,
  '1. Rincer le quinoa à l''eau froide.
2. Faire cuire le quinoa dans 2 fois son volume d''eau salée pendant 15 minutes, puis laisser refroidir.
3. Laver et couper les tomates en dés.
4. Laver et couper les radis en rondelles.
5. Laver et couper le concombre en dés.
6. Émincer finement l''oignon rouge.
7. Dans un grand saladier, mélanger le quinoa refroidi avec tous les légumes.
8. Ajouter les herbes fraîches ciselées (menthe, coriandre).
9. Préparer la vinaigrette en mélangeant l''huile d''olive, le jus de citron, le sel et le poivre.
10. Verser la vinaigrette sur la salade et bien mélanger.
11. Réfrigérer au moins 30 minutes avant de servir.',
  4,
  'summer',
  'system'
);

-- Get the last inserted recipe ID

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 388, 250);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 4, 300);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 57, 100);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 34, 1);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 340, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 334, 10);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 244, 45);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 280, 5);

-- Add ingredient to recipe
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) 
VALUES (last_insert_rowid(), 286, 3);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 86);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 87);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 88);

-- Add kitchen tool to recipe
INSERT INTO recipe_kitchen_tools (recipe_id, kitchen_tool_id) 
VALUES (last_insert_rowid(), 90);

