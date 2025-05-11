-- Migration to populate French names for kitchen tools and spring/summer ingredients (Part 1)

-- 1. Populate French names for kitchen tools
UPDATE kitchen_tools SET french_name = 'Autocuiseur' WHERE name = 'Pressure cooker';
UPDATE kitchen_tools SET french_name = 'Mijoteuse' WHERE name = 'Slow cooker';
UPDATE kitchen_tools SET french_name = 'Robot culinaire' WHERE name = 'Food processor';
UPDATE kitchen_tools SET french_name = 'Mixeur' WHERE name = 'Blender';
UPDATE kitchen_tools SET french_name = 'Robot pâtissier' WHERE name = 'Stand mixer';
UPDATE kitchen_tools SET french_name = 'Mandoline' WHERE name = 'Mandoline';
UPDATE kitchen_tools SET french_name = 'Zesteur/Râpe' WHERE name = 'Zester/Grater';
UPDATE kitchen_tools SET french_name = 'Mortier et pilon' WHERE name = 'Mortar and pestle';
UPDATE kitchen_tools SET french_name = 'Thermomètre' WHERE name = 'Thermometer';
UPDATE kitchen_tools SET french_name = 'Pinceau à pâtisserie' WHERE name = 'Pastry brush';
UPDATE kitchen_tools SET french_name = 'Rouleau à pâtisserie' WHERE name = 'Rolling pin';
UPDATE kitchen_tools SET french_name = 'Pierre à pizza' WHERE name = 'Baking stone';
UPDATE kitchen_tools SET french_name = 'Panier vapeur' WHERE name = 'Steamer basket';
UPDATE kitchen_tools SET french_name = 'Poêle à griller' WHERE name = 'Grill pan';
UPDATE kitchen_tools SET french_name = 'Mixeur plongeant' WHERE name = 'Immersion blender';

-- 2. Update French season names in ingredients
UPDATE ingredients SET french_name = name, season = 'printemps' WHERE season = 'spring' AND user_id = 'system';
UPDATE ingredients SET french_name = name, season = 'été' WHERE season = 'summer' AND user_id = 'system';
UPDATE ingredients SET french_name = name, season = 'automne' WHERE season = 'autumn' AND user_id = 'system';
UPDATE ingredients SET french_name = name, season = 'hiver' WHERE season = 'winter' AND user_id = 'system';

-- 3. Populate French names for spring ingredients
UPDATE ingredients SET french_name = 'Asperge' WHERE name = 'Asparagus' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Artichaut' WHERE name = 'Artichoke' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Oignon nouveau' WHERE name = 'Spring onion' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Petits pois' WHERE name = 'Green peas' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Épinards frais' WHERE name = 'Fresh spinach' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Radis' WHERE name = 'Radish' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Rhubarbe' WHERE name = 'Rhubarb' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Pommes de terre nouvelles' WHERE name = 'New potatoes' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Fèves' WHERE name = 'Fava beans' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Poireaux (printemps)' WHERE name = 'Leeks (spring)' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Fraise' WHERE name = 'Strawberry' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Cerise' WHERE name = 'Cherry' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Abricot' WHERE name = 'Apricot' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Menthe fraîche' WHERE name = 'Fresh mint' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Ciboulette' WHERE name = 'Chives' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Persil frais' WHERE name = 'Fresh parsley' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Estragon' WHERE name = 'Tarragon' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Sardines' WHERE name = 'Sardines' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Maquereau' WHERE name = 'Mackerel' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Truite' WHERE name = 'Trout' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Miel de printemps' WHERE name = 'Spring honey' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Fromage de chèvre' WHERE name = 'Goat cheese' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Agneau' WHERE name = 'Lamb' AND user_id = 'system';

-- 4. Populate French names for summer ingredients
UPDATE ingredients SET french_name = 'Tomate' WHERE name = 'Tomato' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Courgette' WHERE name = 'Zucchini' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Aubergine' WHERE name = 'Eggplant' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Poivron' WHERE name = 'Bell pepper' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Concombre' WHERE name = 'Cucumber' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Maïs' WHERE name = 'Corn' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Haricots verts' WHERE name = 'Green beans' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Gombo' WHERE name = 'Okra' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Pêche' WHERE name = 'Peach' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Nectarine' WHERE name = 'Nectarine' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Framboise' WHERE name = 'Raspberry' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Myrtille' WHERE name = 'Blueberry' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Mûre' WHERE name = 'Blackberry' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Pastèque' WHERE name = 'Watermelon' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Melon' WHERE name = 'Cantaloupe' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Figue' WHERE name = 'Fig' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Basilic frais' WHERE name = 'Fresh basil' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Coriandre' WHERE name = 'Cilantro' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Romarin' WHERE name = 'Rosemary' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Thym' WHERE name = 'Thyme' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Thon' WHERE name = 'Tuna' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Bar' WHERE name = 'Sea bass' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Crevettes' WHERE name = 'Shrimp' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Mozzarella' WHERE name = 'Mozzarella' AND user_id = 'system';
UPDATE ingredients SET french_name = 'Burrata' WHERE name = 'Burrata' AND user_id = 'system';