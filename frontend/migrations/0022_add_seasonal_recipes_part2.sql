-- Migration to add seasonal recipes and ingredients (Part 2 - Spring Recipes)
-- This part adds spring recipes and their connections to ingredients and kitchen tools

-- 4. Add Spring Recipes

-- Spring Breakfast Recipes
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
ON CONFLICT (name, user_id) DO NOTHING
VALUES
('Spring Vegetable Frittata', 'A light and fluffy frittata packed with spring vegetables.', 15, 20, 
'1. Preheat oven to 180°C.
2. Chop spring onions, asparagus, and spinach.
3. Whisk eggs with salt, pepper, and a splash of milk.
4. Heat olive oil in an oven-safe skillet over medium heat.
5. Sauté spring onions until soft, about 2 minutes.
6. Add asparagus and cook for 3 minutes.
7. Add spinach and cook until wilted.
8. Pour egg mixture over vegetables.
9. Cook until edges are set, about 3 minutes.
10. Transfer to oven and bake until fully set, about 10-12 minutes.
11. Let cool slightly before slicing and serving.', 4, 'spring', 'system'),

('Strawberry Rhubarb Overnight Oats', 'Creamy overnight oats with fresh spring strawberries and rhubarb.', 10, 0,
'1. In a jar or container, combine oats, milk, yogurt, and a pinch of salt.
2. Chop rhubarb into small pieces.
3. In a small saucepan, cook rhubarb with a bit of sugar until soft, about 5 minutes.
4. Let rhubarb compote cool completely.
5. Slice strawberries.
6. Layer oat mixture, rhubarb compote, and strawberries in jar.
7. Refrigerate overnight.
8. In the morning, top with honey and fresh mint if desired.', 1, 'spring', 'system'),

('Spring Herb Baked Eggs', 'Eggs baked with fresh spring herbs and goat cheese.', 5, 15,
'1. Preheat oven to 190°C.
2. Butter two small ramekins.
3. Chop fresh herbs (parsley, chives, tarragon).
4. Divide herbs between ramekins.
5. Crack two eggs into each ramekin.
6. Top with crumbled goat cheese, salt, and pepper.
7. Bake until whites are set but yolks are still runny, about 12-15 minutes.
8. Serve with toasted bread.', 2, 'spring', 'system'),

('Asparagus and Goat Cheese Tart', 'A simple puff pastry tart topped with asparagus and goat cheese.', 15, 25,
'1. Preheat oven to 200°C.
2. Roll out puff pastry on a baking sheet.
3. Score a 1cm border around the edge.
4. Spread goat cheese within the border.
5. Arrange asparagus spears on top.
6. Drizzle with olive oil and season with salt and pepper.
7. Bake until pastry is golden and asparagus is tender, about 20-25 minutes.
8. Garnish with fresh herbs before serving.', 4, 'spring', 'system');

-- Spring Lunch Recipes
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
ON CONFLICT (name, user_id) DO NOTHING
VALUES
('Spring Pea Soup', 'A vibrant, fresh soup highlighting the sweetness of spring peas.', 15, 20,
'1. Heat olive oil in a large pot over medium heat.
2. Add chopped onion and cook until translucent, about 5 minutes.
3. Add minced garlic and cook for 30 seconds.
4. Add fresh or frozen peas and vegetable stock.
5. Bring to a simmer and cook until peas are tender, about 5 minutes.
6. Add fresh mint leaves.
7. Using an immersion blender, purée the soup until smooth.
8. Season with salt and pepper.
9. Serve with a swirl of cream and more fresh mint.', 4, 'spring', 'system'),

('Asparagus and Radish Salad', 'A crisp spring salad with blanched asparagus and thinly sliced radishes.', 20, 5,
'1. Bring a pot of salted water to a boil.
2. Prepare an ice bath.
3. Trim asparagus and cut into 5cm pieces.
4. Blanch asparagus for 2 minutes, then transfer to ice bath.
5. Drain and pat dry.
6. Thinly slice radishes.
7. In a small bowl, whisk together lemon juice, olive oil, Dijon mustard, salt, and pepper.
8. Toss asparagus and radishes with dressing.
9. Garnish with fresh herbs and serve.', 2, 'spring', 'system'),

('Spring Vegetable Quiche', 'A savory quiche filled with seasonal spring vegetables.', 30, 45,
'1. Preheat oven to 180°C.
2. Roll out pie crust and fit into a 23cm tart pan.
3. Blind bake the crust for 15 minutes.
4. Meanwhile, sauté spring onions, asparagus, and spinach until tender.
5. In a bowl, whisk together eggs, cream, salt, and pepper.
6. Spread vegetables over the partially baked crust.
7. Pour egg mixture over vegetables.
8. Sprinkle with crumbled goat cheese.
9. Bake until set and golden, about 30 minutes.
10. Let cool slightly before serving.', 6, 'spring', 'system'),

('Fava Bean and Mint Crostini', 'Toasted bread topped with mashed fava beans and fresh mint.', 25, 10,
'1. Shell fava beans.
2. Bring a pot of salted water to a boil.
3. Blanch fava beans for 2 minutes, then transfer to ice bath.
4. Slip off the outer skin of each bean.
5. In a food processor, combine fava beans, olive oil, lemon juice, garlic, salt, and pepper.
6. Pulse until a rough paste forms.
7. Slice a baguette and toast the slices.
8. Spread fava bean mixture on toasts.
9. Garnish with fresh mint leaves and a drizzle of olive oil.', 4, 'spring', 'system'),

('Spring Lamb Sandwich', 'A hearty sandwich with thinly sliced roasted lamb and spring vegetables.', 15, 10,
'1. Slice leftover roasted lamb thinly.
2. Mix mayonnaise with chopped fresh herbs (mint, parsley, chives).
3. Slice radishes and cucumber very thinly.
4. Toast bread slices.
5. Spread herbed mayonnaise on bread.
6. Layer lamb, radishes, cucumber, and fresh greens.
7. Season with salt and pepper.
8. Top with second slice of bread and serve.', 2, 'spring', 'system');

-- Spring Dinner Recipes
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
ON CONFLICT (name, user_id) DO NOTHING
VALUES
('Spring Asparagus Risotto', 'Creamy risotto with fresh asparagus and lemon.', 15, 30,
'1. In a large pot, heat vegetable stock and keep at a simmer.
2. In a separate large pan, heat olive oil over medium heat.
3. Add chopped onion and cook until translucent, about 5 minutes.
4. Add Arborio rice and stir to coat with oil.
5. Add white wine and cook until absorbed.
6. Begin adding hot stock, one ladle at a time, stirring frequently.
7. When rice is halfway cooked, add chopped asparagus.
8. Continue adding stock and stirring until rice is creamy and al dente.
9. Stir in butter, Parmesan cheese, lemon zest, and lemon juice.
10. Season with salt and pepper.
11. Garnish with additional Parmesan and fresh herbs.', 4, 'spring', 'system'),

('Herb-Crusted Rack of Lamb', 'Tender rack of lamb with a fresh herb crust.', 20, 25,
'1. Preheat oven to 200°C.
2. In a food processor, combine fresh herbs (parsley, mint, rosemary), garlic, breadcrumbs, and olive oil.
3. Season lamb rack with salt and pepper.
4. Heat oil in an oven-safe skillet over high heat.
5. Sear lamb on all sides until browned.
6. Brush lamb with Dijon mustard.
7. Press herb mixture onto lamb.
8. Transfer skillet to oven and roast until desired doneness (about 20-25 minutes for medium-rare).
9. Let rest for 10 minutes before slicing between the bones.
10. Serve with spring vegetables.', 4, 'spring', 'system'),

('Spring Vegetable Pasta', 'Light pasta dish showcasing the best spring vegetables.', 15, 15,
'1. Bring a large pot of salted water to a boil.
2. Cook pasta according to package instructions.
3. Meanwhile, heat olive oil in a large skillet over medium heat.
4. Add sliced spring onions and cook for 2 minutes.
5. Add asparagus pieces and cook for 3 minutes.
6. Add peas and cook for 2 minutes more.
7. Add minced garlic and cook for 30 seconds.
8. Drain pasta, reserving 1/2 cup cooking water.
9. Add pasta to skillet with vegetables.
10. Add butter, lemon zest, lemon juice, and some pasta water.
11. Toss until a light sauce forms.
12. Stir in fresh herbs and grated Parmesan.
13. Season with salt and pepper.', 4, 'spring', 'system'),

('Trout with Spring Vegetables', 'Pan-seared trout with a medley of spring vegetables.', 20, 20,
'1. Season trout fillets with salt and pepper.
2. Heat olive oil in a large skillet over medium-high heat.
3. Place trout skin-side down and cook until crisp, about 3-4 minutes.
4. Flip and cook for another 2 minutes. Remove and keep warm.
5. In the same pan, add more oil if needed.
6. Add sliced spring onions and cook for 2 minutes.
7. Add asparagus and cook for 3 minutes.
8. Add peas and cook for 2 minutes more.
9. Add minced garlic and cook for 30 seconds.
10. Deglaze with white wine, scraping up any browned bits.
11. Add butter and lemon juice.
12. Season with salt and pepper.
13. Serve trout over vegetables, garnished with fresh herbs.', 4, 'spring', 'system'),

('Spring Vegetable Stew', 'A light, brothy stew with spring vegetables and herbs.', 20, 30,
'1. Heat olive oil in a large pot over medium heat.
2. Add chopped onion and cook until translucent, about 5 minutes.
3. Add diced carrots and cook for 5 minutes.
4. Add minced garlic and cook for 30 seconds.
5. Add vegetable stock and bring to a simmer.
6. Add diced new potatoes and simmer for 10 minutes.
7. Add chopped asparagus, peas, and fava beans.
8. Simmer until all vegetables are tender, about 5-7 minutes more.
9. Stir in fresh herbs (parsley, chives, tarragon).
10. Season with salt and pepper.
11. Serve with crusty bread.', 6, 'spring', 'system');

-- Spring Dessert Recipes
INSERT INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
ON CONFLICT (name, user_id) DO NOTHING
VALUES
('Strawberry Rhubarb Crisp', 'Sweet strawberries and tart rhubarb topped with a crispy oat topping.', 20, 40,
'1. Preheat oven to 180°C.
2. In a large bowl, combine sliced strawberries, chopped rhubarb, sugar, cornstarch, and lemon juice.
3. Transfer to a baking dish.
4. In another bowl, combine oats, flour, brown sugar, cinnamon, and salt.
5. Cut in cold butter until mixture resembles coarse crumbs.
6. Sprinkle topping over fruit.
7. Bake until fruit is bubbling and topping is golden, about 35-40 minutes.
8. Let cool slightly before serving.
9. Serve with vanilla ice cream if desired.', 6, 'spring', 'system'),

('Lemon Tart with Fresh Berries', 'Tangy lemon tart topped with fresh spring berries.', 30, 45,
'1. Preheat oven to 180°C.
2. Press pie crust into a 23cm tart pan.
3. Blind bake the crust for 15 minutes.
4. Meanwhile, whisk together eggs, sugar, lemon zest, lemon juice, and cream.
5. Pour filling into partially baked crust.
6. Bake until set but still slightly jiggly in the center, about 25-30 minutes.
7. Let cool completely.
8. Top with fresh strawberries and other berries.
9. Dust with powdered sugar before serving.', 8, 'spring', 'system'),

('Honey Lavender Panna Cotta', 'Creamy panna cotta infused with honey and lavender.', 15, 5,
'1. In a small saucepan, heat cream, milk, honey, and lavender.
2. Bring to a simmer, then remove from heat.
3. Let steep for 30 minutes.
4. Strain out lavender.
5. Reheat mixture slightly.
6. Sprinkle gelatin over cold water and let stand for 5 minutes.
7. Stir gelatin into warm cream mixture until dissolved.
8. Pour into ramekins or glasses.
9. Refrigerate until set, at least 4 hours or overnight.
10. Serve with fresh berries and a drizzle of honey.', 4, 'spring', 'system'),

('Rhubarb Almond Cake', 'Moist almond cake topped with tangy rhubarb.', 20, 50,
'1. Preheat oven to 180°C.
2. Butter and flour a 23cm cake pan.
3. In a bowl, whisk together flour, almond flour, baking powder, and salt.
4. In another bowl, beat butter and sugar until light and fluffy.
5. Add eggs one at a time, beating well after each addition.
6. Add vanilla extract and almond extract.
7. Gradually add dry ingredients, mixing just until combined.
8. Spread batter in prepared pan.
9. Arrange sliced rhubarb on top.
10. Sprinkle with sugar.
11. Bake until a toothpick inserted in the center comes out clean, about 45-50 minutes.
12. Let cool before serving.', 8, 'spring', 'system');

-- Link Spring Recipes to Ingredients
-- Spring Vegetable Frittata
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
ON CONFLICT (recipe_id, ingredient_id) DO NOTHING
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Egg' AND user_id = 'system'), 8),
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Spring onion' AND user_id = 'system'), 3),
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Asparagus' AND user_id = 'system'), 200),
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Fresh spinach' AND user_id = 'system'), 100),
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Milk' AND user_id = 'system'), 50),
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Olive oil' AND user_id = 'system'), 15),
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Salt' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Black pepper' AND user_id = 'system'), 2);

-- Strawberry Rhubarb Overnight Oats
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
ON CONFLICT (recipe_id, ingredient_id) DO NOTHING
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Rhubarb' AND user_id = 'system'), 50),
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Strawberry' AND user_id = 'system'), 50),
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Milk' AND user_id = 'system'), 150),
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Yogurt' AND user_id = 'system'), 50),
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Sugar' AND user_id = 'system'), 15),
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Honey' AND user_id = 'system'), 10),
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Fresh mint' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Salt' AND user_id = 'system'), 1);

-- Spring Herb Baked Eggs
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
ON CONFLICT (recipe_id, ingredient_id) DO NOTHING
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Egg' AND user_id = 'system'), 4),
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Butter' AND user_id = 'system'), 10),
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Fresh parsley' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Chives' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Tarragon' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Goat cheese' AND user_id = 'system'), 30),
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Salt' AND user_id = 'system'), 2),
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Black pepper' AND user_id = 'system'), 1);

-- Link Spring Recipes to Kitchen Tools
-- Spring Vegetable Frittata
INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
ON CONFLICT (recipe_id, tool_id) DO NOTHING
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Poêle')),
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Fouet')),
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Couteau')),
((SELECT id FROM recipes WHERE name = 'Spring Vegetable Frittata' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Planche à découper'));

-- Strawberry Rhubarb Overnight Oats
INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
ON CONFLICT (recipe_id, tool_id) DO NOTHING
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Casserole')),
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Couteau')),
((SELECT id FROM recipes WHERE name = 'Strawberry Rhubarb Overnight Oats' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Planche à découper'));

-- Spring Herb Baked Eggs
INSERT INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
ON CONFLICT (recipe_id, tool_id) DO NOTHING
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Four')),
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Couteau')),
((SELECT id FROM recipes WHERE name = 'Spring Herb Baked Eggs' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Planche à découper'));