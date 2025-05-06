-- Migration to translate all recipes, ingredients, and kitchen tools to French (Part 3)

-- 8. Translate seasons in recipes
UPDATE recipes SET season = 'printemps' WHERE season = 'spring' AND user_id = 'system';
UPDATE recipes SET season = 'été' WHERE season = 'summer' AND user_id = 'system';
UPDATE recipes SET season = 'automne' WHERE season = 'autumn' AND user_id = 'system';
UPDATE recipes SET season = 'hiver' WHERE season = 'winter' AND user_id = 'system';

-- 9. Translate recipe names (a sample of recipes from each season)
-- Spring recipes
UPDATE recipes SET name = 'Frittata aux Légumes de Printemps' WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system';
UPDATE recipes SET name = 'Flocons d''Avoine à la Rhubarbe et aux Fraises' WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system';
UPDATE recipes SET name = 'Œufs au Four aux Herbes de Printemps' WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system';
UPDATE recipes SET name = 'Tarte aux Asperges et au Fromage de Chèvre' WHERE name = 'Asparagus and Goat Cheese Tart' AND user_id = 'system';
UPDATE recipes SET name = 'Soupe aux Petits Pois de Printemps' WHERE name = 'Spring Pea Soup' AND user_id = 'system';
UPDATE recipes SET name = 'Salade d''Asperges et de Radis' WHERE name = 'Asparagus and Radish Salad' AND user_id = 'system';
UPDATE recipes SET name = 'Quiche aux Légumes de Printemps' WHERE name = 'Spring Vegetable Quiche' AND user_id = 'system';
UPDATE recipes SET name = 'Crostini aux Fèves et à la Menthe' WHERE name = 'Fava Bean and Mint Crostini' AND user_id = 'system';
UPDATE recipes SET name = 'Sandwich à l''Agneau de Printemps' WHERE name = 'Spring Lamb Sandwich' AND user_id = 'system';
UPDATE recipes SET name = 'Risotto aux Asperges de Printemps' WHERE name = 'Spring Asparagus Risotto' AND user_id = 'system';
UPDATE recipes SET name = 'Carré d''Agneau en Croûte d''Herbes' WHERE name = 'Herb-Crusted Rack of Lamb' AND user_id = 'system';
UPDATE recipes SET name = 'Pâtes aux Légumes de Printemps' WHERE name = 'Spring Vegetable Pasta' AND user_id = 'system';
UPDATE recipes SET name = 'Truite aux Légumes de Printemps' WHERE name = 'Trout with Spring Vegetables' AND user_id = 'system';
UPDATE recipes SET name = 'Ragoût de Légumes de Printemps' WHERE name = 'Spring Vegetable Stew' AND user_id = 'system';
UPDATE recipes SET name = 'Crumble à la Rhubarbe et aux Fraises' WHERE name = 'Strawberry Rhubarb Crisp' AND user_id = 'system';
UPDATE recipes SET name = 'Tarte au Citron et aux Fruits Rouges' WHERE name = 'Lemon Tart with Fresh Berries' AND user_id = 'system';
UPDATE recipes SET name = 'Panna Cotta au Miel et à la Lavande' WHERE name = 'Honey Lavender Panna Cotta' AND user_id = 'system';
UPDATE recipes SET name = 'Gâteau à la Rhubarbe et aux Amandes' WHERE name = 'Rhubarb Almond Cake' AND user_id = 'system';

-- Summer recipes
UPDATE recipes SET name = 'Bol de Smoothie aux Fruits d''Été' WHERE name = 'Summer Berry Smoothie Bowl' AND user_id = 'system';
UPDATE recipes SET name = 'Frittata aux Tomates et aux Herbes' WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system';
UPDATE recipes SET name = 'Toast à la Ricotta et aux Pêches' WHERE name = 'Peach and Ricotta Toast' AND user_id = 'system';
UPDATE recipes SET name = 'Pancakes au Pain de Courgette' WHERE name = 'Zucchini Bread Pancakes' AND user_id = 'system';
UPDATE recipes SET name = 'Gaspacho de Tomates Fraîches' WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system';
UPDATE recipes SET name = 'Salade Caprese' WHERE name = 'Caprese Salad' AND user_id = 'system';
UPDATE recipes SET name = 'Sandwich aux Légumes Grillés' WHERE name = 'Grilled Vegetable Sandwich' AND user_id = 'system';
UPDATE recipes SET name = 'Chaudrée de Maïs d''Été' WHERE name = 'Summer Corn Chowder' AND user_id = 'system';
UPDATE recipes SET name = 'Salade de Pastèque et Feta' WHERE name = 'Watermelon Feta Salad' AND user_id = 'system';
UPDATE recipes SET name = 'Poisson Grillé avec Salsa d''Été' WHERE name = 'Grilled Fish with Summer Salsa' AND user_id = 'system';
UPDATE recipes SET name = 'Ratatouille de Légumes d''Été' WHERE name = 'Summer Vegetable Ratatouille' AND user_id = 'system';
UPDATE recipes SET name = 'Brochettes de Crevettes et Légumes Grillés' WHERE name = 'Grilled Shrimp and Vegetable Skewers' AND user_id = 'system';
UPDATE recipes SET name = 'Pâtes Primavera d''Été' WHERE name = 'Summer Pasta Primavera' AND user_id = 'system';
UPDATE recipes SET name = 'Aubergines Parmigiana Grillées' WHERE name = 'Grilled Eggplant Parmesan' AND user_id = 'system';
UPDATE recipes SET name = 'Tarte aux Fruits Rouges' WHERE name = 'Fresh Berry Tart' AND user_id = 'system';
UPDATE recipes SET name = 'Crumble aux Pêches' WHERE name = 'Peach Cobbler' AND user_id = 'system';
UPDATE recipes SET name = 'Cheesecake aux Fruits Rouges sans Cuisson' WHERE name = 'No-Bake Summer Berry Cheesecake' AND user_id = 'system';
UPDATE recipes SET name = 'Pêches Grillées au Miel et à la Glace' WHERE name = 'Grilled Peaches with Honey and Ice Cream' AND user_id = 'system';

-- Autumn recipes
UPDATE recipes SET name = 'Pancakes à la Citrouille et aux Épices' WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system';
UPDATE recipes SET name = 'Flocons d''Avoine à la Pomme et à la Cannelle' WHERE name = 'Apple Cinnamon Overnight Oats' AND user_id = 'system';
UPDATE recipes SET name = 'Omelette aux Champignons et aux Herbes' WHERE name = 'Mushroom and Herb Omelette' AND user_id = 'system';
UPDATE recipes SET name = 'Muffins aux Poires et aux Noix' WHERE name = 'Spiced Pear and Walnut Muffins' AND user_id = 'system';
UPDATE recipes SET name = 'Soupe à la Courge Butternut' WHERE name = 'Butternut Squash Soup' AND user_id = 'system';
UPDATE recipes SET name = 'Salade Tiède de Lentilles aux Légumes Rôtis' WHERE name = 'Warm Lentil Salad with Roasted Vegetables' AND user_id = 'system';
UPDATE recipes SET name = 'Soupe aux Champignons et à l''Orge' WHERE name = 'Mushroom and Barley Soup' AND user_id = 'system';
UPDATE recipes SET name = 'Panini à la Pomme et au Cheddar' WHERE name = 'Apple and Cheddar Panini' AND user_id = 'system';
UPDATE recipes SET name = 'Salade de Quinoa à la Citrouille Rôtie' WHERE name = 'Roasted Pumpkin and Quinoa Salad' AND user_id = 'system';
UPDATE recipes SET name = 'Ragoût de Chevreuil aux Légumes Racines' WHERE name = 'Venison Stew with Root Vegetables' AND user_id = 'system';
UPDATE recipes SET name = 'Risotto à la Courge Butternut' WHERE name = 'Butternut Squash Risotto' AND user_id = 'system';
UPDATE recipes SET name = 'Wellington aux Champignons et aux Châtaignes' WHERE name = 'Mushroom and Chestnut Wellington' AND user_id = 'system';
UPDATE recipes SET name = 'Côtelettes de Porc à la Sauce au Cidre de Pomme' WHERE name = 'Pork Chops with Apple Cider Sauce' AND user_id = 'system';
UPDATE recipes SET name = 'Courge Farcie' WHERE name = 'Stuffed Acorn Squash' AND user_id = 'system';
UPDATE recipes SET name = 'Crumble aux Pommes' WHERE name = 'Apple Crisp' AND user_id = 'system';
UPDATE recipes SET name = 'Cheesecake à la Citrouille' WHERE name = 'Pumpkin Cheesecake' AND user_id = 'system';
UPDATE recipes SET name = 'Poires Pochées au Vin Rouge' WHERE name = 'Poached Pears in Red Wine' AND user_id = 'system';
UPDATE recipes SET name = 'Pudding au Pain à la Citrouille' WHERE name = 'Pumpkin Bread Pudding' AND user_id = 'system';

-- Winter recipes
UPDATE recipes SET name = 'Porridge à la Canneberge et à l''Orange' WHERE name = 'Cranberry Orange Oatmeal' AND user_id = 'system';
UPDATE recipes SET name = 'Parfait aux Agrumes d''Hiver' WHERE name = 'Winter Citrus Breakfast Parfait' AND user_id = 'system';
UPDATE recipes SET name = 'Flocons d''Avoine Cuits au Four aux Pommes Épicées' WHERE name = 'Spiced Apple Baked Oatmeal' AND user_id = 'system';
UPDATE recipes SET name = 'Frittata aux Légumes d''Hiver' WHERE name = 'Winter Vegetable Frittata' AND user_id = 'system';
UPDATE recipes SET name = 'Soupe aux Haricots Blancs et au Chou Frisé' WHERE name = 'White Bean and Kale Soup' AND user_id = 'system';
UPDATE recipes SET name = 'Salade d''Agrumes d''Hiver' WHERE name = 'Winter Citrus Salad' AND user_id = 'system';
UPDATE recipes SET name = 'Bol de Céréales aux Légumes d''Hiver Rôtis' WHERE name = 'Roasted Winter Vegetable Grain Bowl' AND user_id = 'system';
UPDATE recipes SET name = 'Soupe à l''Oignon Gratinée' WHERE name = 'French Onion Soup' AND user_id = 'system';
UPDATE recipes SET name = 'Panzanella d''Hiver' WHERE name = 'Winter Panzanella' AND user_id = 'system';
UPDATE recipes SET name = 'Bœuf Bourguignon Mijoté' WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system';
UPDATE recipes SET name = 'Confit de Canard aux Lentilles' WHERE name = 'Duck Confit with Lentils' AND user_id = 'system';
UPDATE recipes SET name = 'Hachis Parmentier aux Légumes d''Hiver' WHERE name = 'Winter Vegetable Shepherd''s Pie' AND user_id = 'system';
UPDATE recipes SET name = 'Saumon Glacé aux Agrumes' WHERE name = 'Citrus-Glazed Salmon' AND user_id = 'system';
UPDATE recipes SET name = 'Risotto à la Courge d''Hiver' WHERE name = 'Winter Squash Risotto' AND user_id = 'system';
UPDATE recipes SET name = 'Gâteau à l''Orange et aux Amandes' WHERE name = 'Orange Almond Cake' AND user_id = 'system';
UPDATE recipes SET name = 'Poires Pochées au Vin Épicé' WHERE name = 'Poached Pears in Spiced Wine' AND user_id = 'system';
UPDATE recipes SET name = 'Pudding au Pain à la Canneberge et à l''Orange' WHERE name = 'Cranberry Orange Bread Pudding' AND user_id = 'system';
UPDATE recipes SET name = 'Torte au Chocolat et aux Châtaignes' WHERE name = 'Chocolate Chestnut Torte' AND user_id = 'system';