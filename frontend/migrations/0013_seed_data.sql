-- Migration to seed initial data (in French)

-- Ingrédients
INSERT INTO ingredients (name, unit) VALUES
('Farine', 'g'),
('Oeuf', 'pcs'), -- pièces/unités
('Lait', 'ml'),
('Sucre', 'g'),
('Beurre', 'g'),
('Sel', 'pincée'), -- pinch
('Huile d''olive', 'ml'),
('Tomate', 'pcs'),
('Oignon', 'pcs'),
('Ail', 'gousse'), -- clove
('Pâtes', 'g'),
('Fromage râpé', 'g'),
('Basilic', 'feuille'); -- leaf

-- Ustensiles de cuisine
INSERT INTO kitchen_tools (name) VALUES
('Saladier'),
('Fouet'),
('Poêle'),
('Spatule'),
('Four'),
('Casserole'),
('Plat à gratin'),
('Couteau'),
('Planche à découper');

-- Recettes
-- Recette 1: Crêpes simples
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings) VALUES
('Crêpes Simples', 'Recette de base pour des crêpes légères.', 10, 20, '1. Dans un saladier, mélanger la farine, le sucre et le sel.\n2. Faire un puits et ajouter les oeufs. Mélanger.\n3. Ajouter le lait petit à petit en fouettant pour éviter les grumeaux.\n4. Laisser reposer 30 minutes.\n5. Faire fondre un peu de beurre dans une poêle chaude.\n6. Verser une louche de pâte et cuire chaque côté jusqu''à dorure.', 4);

-- Recette 2: Pâtes à la sauce tomate basique
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings) VALUES
('Pâtes Sauce Tomate Basique', 'Un plat simple et rapide.', 15, 25, '1. Hacher l''oignon et l''ail.\n2. Faire chauffer l''huile d''olive dans une casserole.\n3. Faire revenir l''oignon et l''ail.\n4. Ajouter les tomates (pelées et coupées en dés si fraîches, ou en conserve).\n5. Laisser mijoter 15-20 minutes. Saler.\n6. Pendant ce temps, cuire les pâtes selon les instructions du paquet.\n7. Égoutter les pâtes, verser la sauce dessus. Ajouter du basilic frais et du fromage râpé si désiré.', 2);

-- Associer ingrédients aux recettes
-- Crêpes (Recette ID 1)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(1, (SELECT id FROM ingredients WHERE name = 'Farine'), 250),
(1, (SELECT id FROM ingredients WHERE name = 'Oeuf'), 3),
(1, (SELECT id FROM ingredients WHERE name = 'Lait'), 500),
(1, (SELECT id FROM ingredients WHERE name = 'Sucre'), 50),
(1, (SELECT id FROM ingredients WHERE name = 'Beurre'), 20), -- Pour la cuisson
(1, (SELECT id FROM ingredients WHERE name = 'Sel'), 1);

-- Pâtes Sauce Tomate (Recette ID 2)
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
(2, (SELECT id FROM ingredients WHERE name = 'Pâtes'), 200),
(2, (SELECT id FROM ingredients WHERE name = 'Tomate'), 400), -- Peut être en conserve (g) ou frais (pcs) - ajuster si besoin
(2, (SELECT id FROM ingredients WHERE name = 'Oignon'), 1),
(2, (SELECT id FROM ingredients WHERE name = 'Ail'), 2),
(2, (SELECT id FROM ingredients WHERE name = 'Huile d''olive'), 15),
(2, (SELECT id FROM ingredients WHERE name = 'Sel'), 1),
(2, (SELECT id FROM ingredients WHERE name = 'Basilic'), 5), -- Optionnel
(2, (SELECT id FROM ingredients WHERE name = 'Fromage râpé'), 30); -- Optionnel

-- Associer ustensiles aux recettes
-- Crêpes (Recette ID 1)
INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
(1, (SELECT id FROM kitchen_tools WHERE name = 'Saladier')),
(1, (SELECT id FROM kitchen_tools WHERE name = 'Fouet')),
(1, (SELECT id FROM kitchen_tools WHERE name = 'Poêle')),
(1, (SELECT id FROM kitchen_tools WHERE name = 'Spatule'));

-- Pâtes Sauce Tomate (Recette ID 2)
INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
(2, (SELECT id FROM kitchen_tools WHERE name = 'Casserole')),
(2, (SELECT id FROM kitchen_tools WHERE name = 'Couteau')),
(2, (SELECT id FROM kitchen_tools WHERE name = 'Planche à découper')),
(2, (SELECT id FROM kitchen_tools WHERE name = 'Spatule')); -- Ou cuillère en bois