-- Migration to add seasonal recipes and ingredients (Part 1)
-- This migration adds:
-- 1. New kitchen tools for complex recipes
-- 2. Seasonal ingredients for each season (spring, summer, autumn, winter)
-- 3. Common ingredients available year-round

-- All new recipes and ingredients are assigned to 'system' user_id to indicate they are system-provided

-- 1. Add new kitchen tools
INSERT INTO kitchen_tools (name) VALUES
('Pressure cooker'),
('Slow cooker'),
('Food processor'),
('Blender'),
('Stand mixer'),
('Mandoline'),
('Zester/Grater'),
('Mortar and pestle'),
('Thermometer'),
('Pastry brush'),
('Rolling pin'),
('Baking stone'),
('Steamer basket'),
('Grill pan'),
('Immersion blender');

-- 2. Add seasonal ingredients

-- Spring ingredients (March-May)
INSERT INTO ingredients (name, unit, type, season, user_id) VALUES
-- Vegetables
('Asparagus', 'g', 'légume', 'spring', 'system'),
('Artichoke', 'pcs', 'légume', 'spring', 'system'),
('Spring onion', 'pcs', 'légume', 'spring', 'system'),
('Green peas', 'g', 'légume', 'spring', 'system'),
('Fresh spinach', 'g', 'légume', 'spring', 'system'),
('Radish', 'pcs', 'légume', 'spring', 'system'),
('Rhubarb', 'g', 'légume', 'spring', 'system'),
('New potatoes', 'g', 'légume', 'spring', 'system'),
('Fava beans', 'g', 'légume', 'spring', 'system'),
('Leeks (spring)', 'pcs', 'légume', 'spring', 'system'),
-- Fruits
('Strawberry', 'g', 'fruit', 'spring', 'system'),
('Cherry', 'g', 'fruit', 'spring', 'system'),
('Apricot', 'pcs', 'fruit', 'spring', 'system'),
-- Herbs
('Fresh mint', 'g', 'condiment', 'spring', 'system'),
('Chives', 'g', 'condiment', 'spring', 'system'),
('Fresh parsley', 'g', 'condiment', 'spring', 'system'),
('Tarragon', 'g', 'condiment', 'spring', 'system'),
-- Seafood
('Sardines', 'g', 'poisson', 'spring', 'system'),
('Mackerel', 'g', 'poisson', 'spring', 'system'),
('Trout', 'g', 'poisson', 'spring', 'system'),
-- Other
('Spring honey', 'ml', 'autre', 'spring', 'system'),
('Goat cheese', 'g', 'autre', 'spring', 'system'),
('Lamb', 'g', 'viande', 'spring', 'system');

-- Summer ingredients (June-August)
INSERT INTO ingredients (name, unit, type, season, user_id) VALUES
-- Vegetables
('Tomato', 'g', 'légume', 'summer', 'system'),
('Zucchini', 'pcs', 'légume', 'summer', 'system'),
('Eggplant', 'pcs', 'légume', 'summer', 'system'),
('Bell pepper', 'pcs', 'légume', 'summer', 'system'),
('Cucumber', 'pcs', 'légume', 'summer', 'system'),
('Corn', 'pcs', 'légume', 'summer', 'system'),
('Green beans', 'g', 'légume', 'summer', 'system'),
('Okra', 'g', 'légume', 'summer', 'system'),
-- Fruits
('Peach', 'pcs', 'fruit', 'summer', 'system'),
('Nectarine', 'pcs', 'fruit', 'summer', 'system'),
('Raspberry', 'g', 'fruit', 'summer', 'system'),
('Blueberry', 'g', 'fruit', 'summer', 'system'),
('Blackberry', 'g', 'fruit', 'summer', 'system'),
('Watermelon', 'g', 'fruit', 'summer', 'system'),
('Cantaloupe', 'pcs', 'fruit', 'summer', 'system'),
('Fig', 'pcs', 'fruit', 'summer', 'system'),
-- Herbs
('Fresh basil', 'g', 'condiment', 'summer', 'system'),
('Cilantro', 'g', 'condiment', 'summer', 'system'),
('Rosemary', 'g', 'condiment', 'summer', 'system'),
('Thyme', 'g', 'condiment', 'summer', 'system'),
-- Seafood
('Tuna', 'g', 'poisson', 'summer', 'system'),
('Sea bass', 'g', 'poisson', 'summer', 'system'),
('Shrimp', 'g', 'poisson', 'summer', 'system'),
-- Other
('Mozzarella', 'g', 'autre', 'summer', 'system'),
('Burrata', 'g', 'autre', 'summer', 'system');

-- Autumn ingredients (September-November)
INSERT INTO ingredients (name, unit, type, season, user_id) VALUES
-- Vegetables
('Pumpkin', 'g', 'légume', 'autumn', 'system'),
('Butternut squash', 'g', 'légume', 'autumn', 'system'),
('Sweet potato', 'g', 'légume', 'autumn', 'system'),
('Brussels sprouts', 'g', 'légume', 'autumn', 'system'),
('Cauliflower', 'pcs', 'légume', 'autumn', 'system'),
('Broccoli', 'pcs', 'légume', 'autumn', 'system'),
('Celery root', 'pcs', 'légume', 'autumn', 'system'),
('Turnip', 'pcs', 'légume', 'autumn', 'system'),
-- Fruits
('Apple', 'pcs', 'fruit', 'autumn', 'system'),
('Pear', 'pcs', 'fruit', 'autumn', 'system'),
('Grape', 'g', 'fruit', 'autumn', 'system'),
('Plum', 'pcs', 'fruit', 'autumn', 'system'),
('Quince', 'pcs', 'fruit', 'autumn', 'system'),
('Cranberry', 'g', 'fruit', 'autumn', 'system'),
-- Mushrooms
('Chanterelle', 'g', 'légume', 'autumn', 'system'),
('Porcini', 'g', 'légume', 'autumn', 'system'),
('Shiitake', 'g', 'légume', 'autumn', 'system'),
('Oyster mushroom', 'g', 'légume', 'autumn', 'system'),
-- Meat
('Venison', 'g', 'viande', 'autumn', 'system'),
('Wild boar', 'g', 'viande', 'autumn', 'system'),
('Pheasant', 'g', 'viande', 'autumn', 'system'),
-- Other
('Chestnuts', 'g', 'autre', 'autumn', 'system'),
('Walnuts', 'g', 'autre', 'autumn', 'system'),
('Hazelnuts', 'g', 'autre', 'autumn', 'system');

-- Winter ingredients (December-February)
INSERT INTO ingredients (name, unit, type, season, user_id) VALUES
-- Vegetables
('Kale', 'g', 'légume', 'winter', 'system'),
('Cabbage', 'pcs', 'légume', 'winter', 'system'),
('Leek', 'pcs', 'légume', 'winter', 'system'),
('Parsnip', 'pcs', 'légume', 'winter', 'system'),
('Winter squash', 'g', 'légume', 'winter', 'system'),
('Rutabaga', 'pcs', 'légume', 'winter', 'system'),
('Jerusalem artichoke', 'g', 'légume', 'winter', 'system'),
-- Fruits
('Orange', 'pcs', 'fruit', 'winter', 'system'),
('Clementine', 'pcs', 'fruit', 'winter', 'system'),
('Grapefruit', 'pcs', 'fruit', 'winter', 'system'),
('Pomegranate', 'pcs', 'fruit', 'winter', 'system'),
('Persimmon', 'pcs', 'fruit', 'winter', 'system'),
-- Meat
('Duck', 'g', 'viande', 'winter', 'system'),
('Beef for stew', 'g', 'viande', 'winter', 'system'),
('Pork shoulder', 'g', 'viande', 'winter', 'system'),
-- Pantry items
('Dried beans', 'g', 'autre', 'winter', 'system'),
('Lentils', 'g', 'autre', 'winter', 'system'),
('Pearl barley', 'g', 'autre', 'winter', 'system'),
('Dried mushrooms', 'g', 'autre', 'winter', 'system');

-- 3. Add common ingredients (available year-round)
INSERT INTO ingredients (name, unit, type, season, user_id) VALUES
('Olive oil', 'ml', 'condiment', NULL, 'system'),
('Vegetable oil', 'ml', 'condiment', NULL, 'system'),
('Butter', 'g', 'condiment', NULL, 'system'),
('Salt', 'g', 'condiment', NULL, 'system'),
('Black pepper', 'g', 'condiment', NULL, 'system'),
('Flour', 'g', 'autre', NULL, 'system'),
('Sugar', 'g', 'autre', NULL, 'system'),
('Brown sugar', 'g', 'autre', NULL, 'system'),
('Honey', 'ml', 'autre', NULL, 'system'),
('Maple syrup', 'ml', 'autre', NULL, 'system'),
('Vanilla extract', 'ml', 'condiment', NULL, 'system'),
('Baking powder', 'g', 'autre', NULL, 'system'),
('Baking soda', 'g', 'autre', NULL, 'system'),
('Cinnamon', 'g', 'condiment', NULL, 'system'),
('Nutmeg', 'g', 'condiment', NULL, 'system'),
('Cumin', 'g', 'condiment', NULL, 'system'),
('Paprika', 'g', 'condiment', NULL, 'system'),
('Garlic', 'clove', 'condiment', NULL, 'system'),
('Onion', 'pcs', 'légume', NULL, 'system'),
('Carrot', 'pcs', 'légume', NULL, 'system'),
('Celery', 'pcs', 'légume', NULL, 'system'),
('Potato', 'g', 'légume', NULL, 'system'),
('Rice', 'g', 'autre', NULL, 'system'),
('Pasta', 'g', 'autre', NULL, 'system'),
('Chicken', 'g', 'viande', NULL, 'system'),
('Beef', 'g', 'viande', NULL, 'system'),
('Pork', 'g', 'viande', NULL, 'system'),
('Bacon', 'g', 'viande', NULL, 'system'),
('Egg', 'pcs', 'autre', NULL, 'system'),
('Milk', 'ml', 'boisson', NULL, 'system'),
('Cream', 'ml', 'boisson', NULL, 'system'),
('Yogurt', 'g', 'autre', NULL, 'system'),
('Cheese', 'g', 'autre', NULL, 'system'),
('Parmesan', 'g', 'autre', NULL, 'system'),
('Bread', 'g', 'pain', NULL, 'system'),
('Chicken stock', 'ml', 'autre', NULL, 'system'),
('Beef stock', 'ml', 'autre', NULL, 'system'),
('Vegetable stock', 'ml', 'autre', NULL, 'system'),
('White wine', 'ml', 'boisson', NULL, 'system'),
('Red wine', 'ml', 'boisson', NULL, 'system'),
('Lemon', 'pcs', 'fruit', NULL, 'system'),
('Lime', 'pcs', 'fruit', NULL, 'system');