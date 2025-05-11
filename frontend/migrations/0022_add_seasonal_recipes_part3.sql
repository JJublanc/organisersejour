-- Migration to add seasonal recipes and ingredients (Part 3 - Summer Recipes)
-- This part adds summer recipes and their connections to ingredients and kitchen tools

-- 5. Add Summer Recipes

-- Summer Breakfast Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Summer Berry Smoothie Bowl', 'A refreshing smoothie bowl packed with summer berries.', 10, 0,
'1. In a blender, combine frozen mixed berries, banana, yogurt, and a splash of milk.
2. Blend until smooth but thick.
3. Pour into a bowl.
4. Top with fresh berries, granola, and a drizzle of honey.
5. Add optional toppings like chia seeds, coconut flakes, or sliced almonds.', 1, 'summer', 'system'),

('Tomato and Herb Frittata', 'A light summer frittata with fresh tomatoes and herbs.', 10, 15,
'1. Preheat oven to 180°C.
2. In a bowl, whisk eggs with salt and pepper.
3. Heat olive oil in an oven-safe skillet over medium heat.
4. Add sliced cherry tomatoes and cook for 2 minutes.
5. Add chopped fresh herbs (basil, parsley, chives).
6. Pour egg mixture over tomatoes and herbs.
7. Cook until edges are set, about 3 minutes.
8. Transfer to oven and bake until fully set, about 10-12 minutes.
9. Let cool slightly before slicing and serving.', 4, 'summer', 'system'),

('Peach and Ricotta Toast', 'Toasted bread topped with creamy ricotta and fresh summer peaches.', 5, 5,
'1. Toast bread slices.
2. Spread ricotta cheese on toast.
3. Top with sliced fresh peaches.
4. Drizzle with honey.
5. Sprinkle with cinnamon and a few fresh basil leaves.', 2, 'summer', 'system'),

('Zucchini Bread Pancakes', 'Fluffy pancakes with grated zucchini and warm spices.', 15, 15,
'1. In a large bowl, whisk together flour, baking powder, cinnamon, nutmeg, and salt.
2. In another bowl, whisk together eggs, milk, vanilla, and maple syrup.
3. Stir wet ingredients into dry ingredients.
4. Fold in grated zucchini (squeezed of excess moisture) and lemon zest.
5. Heat a griddle or pan over medium heat and grease lightly.
6. Pour 1/4 cup batter for each pancake.
7. Cook until bubbles form on surface, then flip and cook until golden.
8. Serve with maple syrup and fresh berries.', 4, 'summer', 'system');

-- Summer Lunch Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Fresh Tomato Gazpacho', 'A cold soup perfect for hot summer days.', 20, 0,
'1. Roughly chop tomatoes, cucumber, bell pepper, and red onion.
2. Add to a blender along with garlic, olive oil, red wine vinegar, and a slice of bread soaked in water and squeezed.
3. Blend until smooth.
4. Season with salt and pepper.
5. Chill for at least 2 hours.
6. Serve cold, garnished with diced vegetables and a drizzle of olive oil.', 4, 'summer', 'system'),

('Caprese Salad', 'A classic Italian salad with tomatoes, mozzarella, and basil.', 10, 0,
'1. Slice tomatoes and mozzarella.
2. Arrange tomato and mozzarella slices on a plate, alternating them.
3. Tuck fresh basil leaves between the slices.
4. Drizzle with olive oil.
5. Season with salt and pepper.
6. Optional: drizzle with balsamic glaze.', 2, 'summer', 'system'),

('Grilled Vegetable Sandwich', 'A hearty sandwich with grilled summer vegetables and pesto.', 15, 10,
'1. Slice zucchini, eggplant, and bell peppers.
2. Brush vegetables with olive oil and season with salt and pepper.
3. Grill vegetables until tender and lightly charred.
4. Spread pesto on bread slices.
5. Layer grilled vegetables and fresh mozzarella on bread.
6. Add fresh basil leaves.
7. Close sandwich and serve.', 2, 'summer', 'system'),

('Summer Corn Chowder', 'A light and creamy soup featuring fresh summer corn.', 20, 25,
'1. In a large pot, cook diced bacon until crisp. Remove and set aside.
2. In the same pot, sauté diced onion and diced bell pepper until soft.
3. Add minced garlic and cook for 30 seconds.
4. Add diced potatoes and chicken stock.
5. Bring to a simmer and cook until potatoes are tender, about 15 minutes.
6. Add corn kernels and cook for 5 minutes more.
7. Stir in cream and heat through.
8. Season with salt and pepper.
9. Serve garnished with reserved bacon and chopped fresh herbs.', 6, 'summer', 'system'),

('Watermelon Feta Salad', 'A refreshing salad combining sweet watermelon with salty feta.', 15, 0,
'1. Cut watermelon into cubes.
2. Crumble feta cheese.
3. Thinly slice red onion.
4. In a large bowl, combine watermelon, feta, red onion, and fresh mint leaves.
5. In a small bowl, whisk together olive oil, lime juice, salt, and pepper.
6. Drizzle dressing over salad and toss gently.
7. Serve immediately.', 4, 'summer', 'system');

-- Summer Dinner Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Grilled Fish with Summer Salsa', 'Grilled fish topped with a fresh summer fruit salsa.', 20, 10,
'1. Make the salsa: combine diced peach, diced cucumber, diced red onion, minced jalapeño, chopped cilantro, lime juice, and salt.
2. Let salsa sit while preparing the fish.
3. Season fish fillets with salt, pepper, and a drizzle of olive oil.
4. Grill fish for 3-4 minutes per side, until cooked through.
5. Serve fish topped with summer salsa.
6. Garnish with additional cilantro and lime wedges.', 4, 'summer', 'system'),

('Summer Vegetable Ratatouille', 'A classic French stew featuring summer vegetables.', 30, 45,
'1. Dice eggplant, zucchini, bell peppers, and onion.
2. Mince garlic.
3. Heat olive oil in a large pot over medium heat.
4. Add onion and cook until translucent, about 5 minutes.
5. Add garlic and cook for 30 seconds.
6. Add eggplant and cook for 5 minutes.
7. Add zucchini and bell peppers and cook for 5 minutes more.
8. Add diced tomatoes, thyme, rosemary, salt, and pepper.
9. Simmer, partially covered, until vegetables are tender, about 30 minutes.
10. Stir in fresh basil before serving.
11. Serve hot or at room temperature.', 6, 'summer', 'system'),

('Grilled Shrimp and Vegetable Skewers', 'Skewers of juicy shrimp and summer vegetables.', 20, 10,
'1. If using wooden skewers, soak in water for 30 minutes.
2. Peel and devein shrimp.
3. Cut zucchini, bell peppers, and red onion into chunks.
4. In a bowl, whisk together olive oil, lemon juice, minced garlic, chopped herbs, salt, and pepper.
5. Toss shrimp and vegetables in marinade.
6. Thread shrimp and vegetables onto skewers, alternating.
7. Grill skewers for 2-3 minutes per side, until shrimp are pink and vegetables are tender.
8. Serve with lemon wedges.', 4, 'summer', 'system'),

('Summer Pasta Primavera', 'Pasta tossed with fresh summer vegetables and herbs.', 20, 15,
'1. Bring a large pot of salted water to a boil.
2. Cook pasta according to package instructions.
3. Meanwhile, heat olive oil in a large skillet over medium heat.
4. Add diced zucchini, cherry tomatoes, and corn kernels.
5. Cook until vegetables are tender, about 5-7 minutes.
6. Add minced garlic and cook for 30 seconds.
7. Drain pasta, reserving 1/2 cup cooking water.
8. Add pasta to skillet with vegetables.
9. Add butter, lemon zest, lemon juice, and some pasta water.
10. Toss until a light sauce forms.
11. Stir in fresh herbs and grated Parmesan.
12. Season with salt and pepper.', 4, 'summer', 'system'),

('Grilled Eggplant Parmesan', 'A lighter summer version of the classic Italian dish.', 25, 20,
'1. Slice eggplant into 1cm rounds.
2. Brush eggplant slices with olive oil and season with salt and pepper.
3. Grill eggplant until tender and lightly charred, about 3-4 minutes per side.
4. Preheat oven to 190°C.
5. In a baking dish, spread a thin layer of tomato sauce.
6. Arrange a layer of grilled eggplant over sauce.
7. Top with mozzarella and Parmesan.
8. Repeat layers, ending with cheese.
9. Bake until cheese is melted and bubbly, about 15-20 minutes.
10. Garnish with fresh basil before serving.', 6, 'summer', 'system');

-- Summer Dessert Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Fresh Berry Tart', 'A buttery tart shell filled with pastry cream and topped with summer berries.', 40, 25,
'1. Preheat oven to 180°C.
2. Press tart dough into a 23cm tart pan.
3. Blind bake the crust for 20-25 minutes, until golden.
4. Let cool completely.
5. Meanwhile, make pastry cream: heat milk until steaming.
6. Whisk together egg yolks, sugar, cornstarch, and salt.
7. Slowly whisk hot milk into egg mixture.
8. Return mixture to saucepan and cook, whisking constantly, until thickened.
9. Remove from heat and stir in butter and vanilla.
10. Strain pastry cream and let cool completely.
11. Spread pastry cream in cooled tart shell.
12. Arrange fresh berries on top.
13. Brush with warmed apricot jam if desired.', 8, 'summer', 'system'),

('Peach Cobbler', 'A rustic dessert with juicy peaches and a buttery biscuit topping.', 20, 45,
'1. Preheat oven to 180°C.
2. In a large bowl, combine sliced peaches, sugar, cornstarch, lemon juice, and cinnamon.
3. Transfer to a baking dish.
4. In another bowl, whisk together flour, sugar, baking powder, and salt.
5. Cut in cold butter until mixture resembles coarse crumbs.
6. Stir in milk just until combined.
7. Drop spoonfuls of dough over peaches.
8. Sprinkle with sugar.
9. Bake until topping is golden and filling is bubbling, about 40-45 minutes.
10. Let cool slightly before serving.
11. Serve with vanilla ice cream if desired.', 8, 'summer', 'system'),

('No-Bake Summer Berry Cheesecake', 'A cool, creamy cheesecake perfect for hot summer days.', 30, 0,
'1. In a food processor, pulse graham crackers until fine crumbs form.
2. Add melted butter and pulse to combine.
3. Press mixture into the bottom of a springform pan.
4. Refrigerate while preparing filling.
5. In a large bowl, beat cream cheese and sugar until smooth.
6. Add vanilla extract.
7. In another bowl, whip cream until stiff peaks form.
8. Fold whipped cream into cream cheese mixture.
9. Fold in some chopped berries.
10. Pour filling over crust and smooth top.
11. Refrigerate until set, at least 4 hours or overnight.
12. Top with additional fresh berries before serving.', 12, 'summer', 'system'),

('Grilled Peaches with Honey and Ice Cream', 'Simple grilled peaches transformed into an elegant dessert.', 10, 5,
'1. Heat grill to medium-high.
2. Cut peaches in half and remove pits.
3. Brush cut sides with melted butter.
4. Grill peaches, cut side down, until grill marks appear, about 3-4 minutes.
5. Flip and grill for 1-2 minutes more.
6. Place grilled peaches on plates.
7. Top each with a scoop of vanilla ice cream.
8. Drizzle with honey.
9. Sprinkle with chopped pistachios if desired.', 4, 'summer', 'system');

-- Link Summer Recipes to Ingredients
-- Summer Berry Smoothie Bowl
INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
((SELECT id FROM recipes WHERE name = 'Summer Berry Smoothie Bowl' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Raspberry' AND user_id = 'system'), 100),
((SELECT id FROM recipes WHERE name = 'Summer Berry Smoothie Bowl' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Blueberry' AND user_id = 'system'), 50),
((SELECT id FROM recipes WHERE name = 'Summer Berry Smoothie Bowl' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Yogurt' AND user_id = 'system'), 100),
((SELECT id FROM recipes WHERE name = 'Summer Berry Smoothie Bowl' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Milk' AND user_id = 'system'), 50),
((SELECT id FROM recipes WHERE name = 'Summer Berry Smoothie Bowl' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Honey' AND user_id = 'system'), 15);

-- Tomato and Herb Frittata
INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Egg' AND user_id = 'system'), 8),
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Tomato' AND user_id = 'system'), 200),
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Fresh basil' AND user_id = 'system'), 10),
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Olive oil' AND user_id = 'system'), 15),
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Salt' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Black pepper' AND user_id = 'system'), 2);

-- Fresh Tomato Gazpacho
INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Tomato' AND user_id = 'system'), 500),
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Cucumber' AND user_id = 'system'), 1),
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Bell pepper' AND user_id = 'system'), 1),
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Onion' AND user_id = 'system'), 0.5),
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Garlic' AND user_id = 'system'), 1),
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Olive oil' AND user_id = 'system'), 30),
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Red wine' AND user_id = 'system'), 15),
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Bread' AND user_id = 'system'), 50);

-- Link Summer Recipes to Kitchen Tools
-- Summer Berry Smoothie Bowl
INSERT OR IGNORE INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
((SELECT id FROM recipes WHERE name = 'Summer Berry Smoothie Bowl' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Blender'));

-- Tomato and Herb Frittata
INSERT OR IGNORE INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Poêle')),
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Fouet')),
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Four')),
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Couteau')),
((SELECT id FROM recipes WHERE name = 'Tomato and Herb Frittata' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Planche à découper'));

-- Fresh Tomato Gazpacho
INSERT OR IGNORE INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Blender')),
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Couteau')),
((SELECT id FROM recipes WHERE name = 'Fresh Tomato Gazpacho' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Planche à découper'));