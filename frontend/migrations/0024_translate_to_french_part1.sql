-- Migration to translate all recipes, ingredients, and kitchen tools to French (Part 1)

-- 1. Translate kitchen tools
UPDATE kitchen_tools SET name = 'Autocuiseur' WHERE name = 'Pressure cooker';
UPDATE kitchen_tools SET name = 'Mijoteuse' WHERE name = 'Slow cooker';
UPDATE kitchen_tools SET name = 'Robot culinaire' WHERE name = 'Food processor';
UPDATE kitchen_tools SET name = 'Mixeur' WHERE name = 'Blender';
UPDATE kitchen_tools SET name = 'Robot pâtissier' WHERE name = 'Stand mixer';
UPDATE kitchen_tools SET name = 'Mandoline' WHERE name = 'Mandoline';
UPDATE kitchen_tools SET name = 'Zesteur/Râpe' WHERE name = 'Zester/Grater';
UPDATE kitchen_tools SET name = 'Mortier et pilon' WHERE name = 'Mortar and pestle';
UPDATE kitchen_tools SET name = 'Thermomètre' WHERE name = 'Thermometer';
UPDATE kitchen_tools SET name = 'Pinceau à pâtisserie' WHERE name = 'Pastry brush';
UPDATE kitchen_tools SET name = 'Rouleau à pâtisserie' WHERE name = 'Rolling pin';
UPDATE kitchen_tools SET name = 'Pierre à pizza' WHERE name = 'Baking stone';
UPDATE kitchen_tools SET name = 'Panier vapeur' WHERE name = 'Steamer basket';
UPDATE kitchen_tools SET name = 'Poêle à griller' WHERE name = 'Grill pan';
UPDATE kitchen_tools SET name = 'Mixeur plongeant' WHERE name = 'Immersion blender';

-- 2. Translate seasons in ingredients
UPDATE ingredients SET season = 'printemps' WHERE season = 'spring' AND user_id = 'system';
UPDATE ingredients SET season = 'été' WHERE season = 'summer' AND user_id = 'system';
UPDATE ingredients SET season = 'automne' WHERE season = 'autumn' AND user_id = 'system';
UPDATE ingredients SET season = 'hiver' WHERE season = 'winter' AND user_id = 'system';

-- 3. Translate spring ingredients
UPDATE ingredients SET name = 'Asperge' WHERE name = 'Asparagus' AND user_id = 'system';
UPDATE ingredients SET name = 'Artichaut' WHERE name = 'Artichoke' AND user_id = 'system';
UPDATE ingredients SET name = 'Oignon nouveau' WHERE name = 'Spring onion' AND user_id = 'system';
UPDATE ingredients SET name = 'Petits pois' WHERE name = 'Green peas' AND user_id = 'system';
UPDATE ingredients SET name = 'Épinards frais' WHERE name = 'Fresh spinach' AND user_id = 'system';
UPDATE ingredients SET name = 'Radis' WHERE name = 'Radish' AND user_id = 'system';
UPDATE ingredients SET name = 'Rhubarbe' WHERE name = 'Rhubarb' AND user_id = 'system';
UPDATE ingredients SET name = 'Pommes de terre nouvelles' WHERE name = 'New potatoes' AND user_id = 'system';
UPDATE ingredients SET name = 'Fèves' WHERE name = 'Fava beans' AND user_id = 'system';
UPDATE ingredients SET name = 'Poireaux (printemps)' WHERE name = 'Leeks (spring)' AND user_id = 'system';
UPDATE ingredients SET name = 'Fraise' WHERE name = 'Strawberry' AND user_id = 'system';
UPDATE ingredients SET name = 'Cerise' WHERE name = 'Cherry' AND user_id = 'system';
UPDATE ingredients SET name = 'Abricot' WHERE name = 'Apricot' AND user_id = 'system';
UPDATE ingredients SET name = 'Menthe fraîche' WHERE name = 'Fresh mint' AND user_id = 'system';
UPDATE ingredients SET name = 'Ciboulette' WHERE name = 'Chives' AND user_id = 'system';
UPDATE ingredients SET name = 'Persil frais' WHERE name = 'Fresh parsley' AND user_id = 'system';
UPDATE ingredients SET name = 'Estragon' WHERE name = 'Tarragon' AND user_id = 'system';
UPDATE ingredients SET name = 'Sardines' WHERE name = 'Sardines' AND user_id = 'system';
UPDATE ingredients SET name = 'Maquereau' WHERE name = 'Mackerel' AND user_id = 'system';
UPDATE ingredients SET name = 'Truite' WHERE name = 'Trout' AND user_id = 'system';
UPDATE ingredients SET name = 'Miel de printemps' WHERE name = 'Spring honey' AND user_id = 'system';
UPDATE ingredients SET name = 'Fromage de chèvre' WHERE name = 'Goat cheese' AND user_id = 'system';
UPDATE ingredients SET name = 'Agneau' WHERE name = 'Lamb' AND user_id = 'system';

-- 4. Translate summer ingredients
UPDATE ingredients SET name = 'Tomate' WHERE name = 'Tomato' AND user_id = 'system';
UPDATE ingredients SET name = 'Courgette' WHERE name = 'Zucchini' AND user_id = 'system';
UPDATE ingredients SET name = 'Aubergine' WHERE name = 'Eggplant' AND user_id = 'system';
UPDATE ingredients SET name = 'Poivron' WHERE name = 'Bell pepper' AND user_id = 'system';
UPDATE ingredients SET name = 'Concombre' WHERE name = 'Cucumber' AND user_id = 'system';
UPDATE ingredients SET name = 'Maïs' WHERE name = 'Corn' AND user_id = 'system';
UPDATE ingredients SET name = 'Haricots verts' WHERE name = 'Green beans' AND user_id = 'system';
UPDATE ingredients SET name = 'Gombo' WHERE name = 'Okra' AND user_id = 'system';
UPDATE ingredients SET name = 'Pêche' WHERE name = 'Peach' AND user_id = 'system';
UPDATE ingredients SET name = 'Nectarine' WHERE name = 'Nectarine' AND user_id = 'system';
UPDATE ingredients SET name = 'Framboise' WHERE name = 'Raspberry' AND user_id = 'system';
UPDATE ingredients SET name = 'Myrtille' WHERE name = 'Blueberry' AND user_id = 'system';
UPDATE ingredients SET name = 'Mûre' WHERE name = 'Blackberry' AND user_id = 'system';
UPDATE ingredients SET name = 'Pastèque' WHERE name = 'Watermelon' AND user_id = 'system';
UPDATE ingredients SET name = 'Melon' WHERE name = 'Cantaloupe' AND user_id = 'system';
UPDATE ingredients SET name = 'Figue' WHERE name = 'Fig' AND user_id = 'system';
UPDATE ingredients SET name = 'Basilic frais' WHERE name = 'Fresh basil' AND user_id = 'system';
UPDATE ingredients SET name = 'Coriandre' WHERE name = 'Cilantro' AND user_id = 'system';
UPDATE ingredients SET name = 'Romarin' WHERE name = 'Rosemary' AND user_id = 'system';
UPDATE ingredients SET name = 'Thym' WHERE name = 'Thyme' AND user_id = 'system';
UPDATE ingredients SET name = 'Thon' WHERE name = 'Tuna' AND user_id = 'system';
UPDATE ingredients SET name = 'Bar' WHERE name = 'Sea bass' AND user_id = 'system';
UPDATE ingredients SET name = 'Crevettes' WHERE name = 'Shrimp' AND user_id = 'system';
UPDATE ingredients SET name = 'Mozzarella' WHERE name = 'Mozzarella' AND user_id = 'system';
UPDATE ingredients SET name = 'Burrata' WHERE name = 'Burrata' AND user_id = 'system';