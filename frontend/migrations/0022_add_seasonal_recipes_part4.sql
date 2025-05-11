-- Migration to add seasonal recipes and ingredients (Part 4 - Autumn Recipes)
-- This part adds autumn recipes and their connections to ingredients and kitchen tools

-- 6. Add Autumn Recipes

-- Autumn Breakfast Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Pumpkin Spice Pancakes', 'Fluffy pancakes with warm autumn spices and pumpkin.', 15, 15,
'1. In a large bowl, whisk together flour, baking powder, baking soda, salt, cinnamon, nutmeg, and ginger.
2. In another bowl, whisk together pumpkin puree, milk, eggs, maple syrup, and vanilla.
3. Stir wet ingredients into dry ingredients until just combined.
4. Heat a griddle or pan over medium heat and grease lightly.
5. Pour 1/4 cup batter for each pancake.
6. Cook until bubbles form on surface, then flip and cook until golden.
7. Serve with maple syrup and chopped nuts.', 4, 'autumn', 'system'),

('Apple Cinnamon Overnight Oats', 'Creamy overnight oats with fresh autumn apples and cinnamon.', 10, 0,
'1. In a jar or container, combine oats, milk, yogurt, cinnamon, and a pinch of salt.
2. Dice apple into small pieces.
3. In a small saucepan, cook apple with a bit of sugar and cinnamon until soft, about 5 minutes.
4. Let apple compote cool completely.
5. Layer oat mixture and apple compote in jar.
6. Refrigerate overnight.
7. In the morning, top with chopped nuts and a drizzle of maple syrup if desired.', 1, 'autumn', 'system'),

('Mushroom and Herb Omelette', 'A savory omelette with autumn mushrooms and fresh herbs.', 10, 10,
'1. In a bowl, whisk eggs with salt and pepper.
2. Heat butter in a non-stick skillet over medium heat.
3. Add sliced mushrooms and cook until golden, about 5 minutes.
4. Add chopped herbs and cook for 30 seconds more.
5. Pour egg mixture over mushrooms.
6. Cook until edges are set, then use a spatula to gently lift edges and let uncooked egg flow underneath.
7. When mostly set, fold omelette in half.
8. Cook for another minute, then slide onto a plate.
9. Serve with toast and a sprinkle of additional herbs.', 1, 'autumn', 'system'),

('Spiced Pear and Walnut Muffins', 'Moist muffins with chunks of pear and crunchy walnuts.', 20, 25,
'1. Preheat oven to 180°C.
2. Line a muffin tin with paper liners.
3. In a bowl, whisk together flour, baking powder, baking soda, salt, cinnamon, nutmeg, and ginger.
4. In another bowl, whisk together melted butter, brown sugar, eggs, and vanilla.
5. Stir wet ingredients into dry ingredients.
6. Fold in diced pears and chopped walnuts.
7. Divide batter among muffin cups.
8. Sprinkle tops with a mixture of sugar and cinnamon.
9. Bake until a toothpick inserted in the center comes out clean, about 20-25 minutes.
10. Let cool in pan for 5 minutes, then transfer to a wire rack to cool completely.', 12, 'autumn', 'system');

-- Autumn Lunch Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Butternut Squash Soup', 'A creamy, warming soup perfect for autumn days.', 20, 40,
'1. Heat olive oil in a large pot over medium heat.
2. Add chopped onion and cook until translucent, about 5 minutes.
3. Add diced butternut squash, diced apple, and minced garlic.
4. Cook for 5 minutes, stirring occasionally.
5. Add vegetable stock, cinnamon, nutmeg, salt, and pepper.
6. Bring to a simmer and cook until squash is very tender, about 25-30 minutes.
7. Using an immersion blender, purée the soup until smooth.
8. Stir in cream.
9. Adjust seasoning if needed.
10. Serve garnished with a swirl of cream and toasted pumpkin seeds.', 6, 'autumn', 'system'),

('Warm Lentil Salad with Roasted Vegetables', 'A hearty salad with earthy lentils and autumn vegetables.', 20, 30,
'1. Preheat oven to 200°C.
2. Toss diced butternut squash, Brussels sprouts, and red onion with olive oil, salt, and pepper.
3. Spread on a baking sheet and roast until tender and caramelized, about 25-30 minutes.
4. Meanwhile, rinse lentils and place in a pot with water or stock.
5. Bring to a simmer and cook until tender but not mushy, about 20-25 minutes.
6. Drain lentils and transfer to a bowl.
7. In a small bowl, whisk together olive oil, balsamic vinegar, Dijon mustard, minced garlic, salt, and pepper.
8. Add roasted vegetables to lentils.
9. Pour dressing over and toss gently.
10. Fold in chopped fresh herbs.
11. Serve warm or at room temperature.', 4, 'autumn', 'system'),

('Mushroom and Barley Soup', 'A rustic soup with wild mushrooms and hearty barley.', 20, 45,
'1. Heat olive oil in a large pot over medium heat.
2. Add chopped onion, diced carrot, and diced celery.
3. Cook until vegetables are softened, about 5-7 minutes.
4. Add sliced mushrooms and cook until they release their moisture and begin to brown, about 8-10 minutes.
5. Add minced garlic and cook for 30 seconds.
6. Add pearl barley, vegetable or beef stock, thyme, bay leaf, salt, and pepper.
7. Bring to a simmer and cook until barley is tender, about 30-35 minutes.
8. Remove bay leaf and thyme sprigs.
9. Stir in chopped fresh parsley.
10. Adjust seasoning if needed.
11. Serve hot.', 6, 'autumn', 'system'),

('Apple and Cheddar Panini', 'A savory-sweet sandwich with crisp apples and sharp cheddar.', 10, 10,
'1. Butter one side of each bread slice.
2. Place bread butter-side down on a work surface.
3. Spread Dijon mustard on the inside of each slice.
4. Layer cheddar cheese, thinly sliced apple, and arugula on one slice.
5. Top with the second slice, butter-side up.
6. Heat a panini press or skillet over medium heat.
7. Cook sandwich until bread is golden and cheese is melted, about 3-4 minutes per side if using a skillet.
8. Cut in half and serve immediately.', 1, 'autumn', 'system'),

('Roasted Pumpkin and Quinoa Salad', 'A nutritious salad with roasted pumpkin and protein-rich quinoa.', 20, 30,
'1. Preheat oven to 200°C.
2. Toss pumpkin cubes with olive oil, salt, and pepper.
3. Spread on a baking sheet and roast until tender and caramelized, about 25-30 minutes.
4. Meanwhile, rinse quinoa and place in a pot with water or stock.
5. Bring to a simmer and cook until tender and water is absorbed, about 15 minutes.
6. Fluff quinoa with a fork and let cool slightly.
7. In a large bowl, combine quinoa, roasted pumpkin, dried cranberries, chopped toasted pecans, and crumbled feta.
8. In a small bowl, whisk together olive oil, apple cider vinegar, honey, Dijon mustard, salt, and pepper.
9. Pour dressing over salad and toss gently.
10. Serve warm or at room temperature.', 4, 'autumn', 'system');

-- Autumn Dinner Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Venison Stew with Root Vegetables', 'A rich, hearty stew with tender venison and autumn vegetables.', 30, 120,
'1. Season venison cubes with salt and pepper.
2. Heat oil in a large Dutch oven over high heat.
3. Working in batches, brown venison on all sides. Transfer to a plate.
4. Reduce heat to medium and add chopped onion, diced carrot, and diced celery.
5. Cook until vegetables are softened, about 5-7 minutes.
6. Add minced garlic and cook for 30 seconds.
7. Add tomato paste and cook, stirring, for 1 minute.
8. Add red wine and scrape up any browned bits from the bottom of the pot.
9. Return venison to the pot along with any accumulated juices.
10. Add beef stock, bay leaves, thyme, and rosemary.
11. Bring to a simmer, then reduce heat to low.
12. Cover and cook for 1.5 hours.
13. Add diced parsnips, turnips, and potatoes.
14. Continue cooking until venison and vegetables are tender, about 30-45 minutes more.
15. Season with salt and pepper to taste.
16. Serve hot, garnished with fresh herbs.', 6, 'autumn', 'system'),

('Butternut Squash Risotto', 'Creamy risotto with roasted butternut squash and sage.', 20, 40,
'1. Preheat oven to 200°C.
2. Toss butternut squash cubes with olive oil, salt, and pepper.
3. Spread on a baking sheet and roast until tender and caramelized, about 25-30 minutes.
4. In a large pot, heat vegetable stock and keep at a simmer.
5. In a separate large pan, heat olive oil over medium heat.
6. Add chopped onion and cook until translucent, about 5 minutes.
7. Add Arborio rice and stir to coat with oil.
8. Add white wine and cook until absorbed.
9. Begin adding hot stock, one ladle at a time, stirring frequently.
10. When rice is halfway cooked, add half of the roasted squash.
11. Continue adding stock and stirring until rice is creamy and al dente.
12. Stir in butter, Parmesan cheese, chopped sage, salt, and pepper.
13. Gently fold in remaining roasted squash.
14. Serve immediately, garnished with additional Parmesan and fried sage leaves if desired.', 4, 'autumn', 'system'),

('Mushroom and Chestnut Wellington', 'A vegetarian main course with wild mushrooms and chestnuts wrapped in puff pastry.', 45, 40,
'1. Preheat oven to 200°C.
2. Heat olive oil in a large skillet over medium heat.
3. Add chopped onion and cook until translucent, about 5 minutes.
4. Add sliced mushrooms and cook until they release their moisture and begin to brown, about 8-10 minutes.
5. Add minced garlic and chopped chestnuts and cook for 2 minutes more.
6. Add chopped fresh herbs, salt, and pepper.
7. Transfer mixture to a bowl and let cool completely.
8. Roll out puff pastry on a floured surface.
9. Spread mushroom mixture down the center of the pastry, leaving a border on all sides.
10. Fold the pastry over the filling, sealing the edges.
11. Transfer to a baking sheet and brush with beaten egg.
12. Cut a few small slits in the top for steam to escape.
13. Bake until pastry is golden and puffed, about 35-40 minutes.
14. Let cool for 10 minutes before slicing and serving.', 6, 'autumn', 'system'),

('Pork Chops with Apple Cider Sauce', 'Juicy pork chops with a savory-sweet apple cider reduction.', 15, 25,
'1. Season pork chops with salt and pepper.
2. Heat olive oil in a large skillet over medium-high heat.
3. Add pork chops and cook until browned and cooked through, about 4-5 minutes per side.
4. Transfer to a plate and keep warm.
5. In the same skillet, add sliced onion and cook until softened, about 3-4 minutes.
6. Add sliced apple and cook for 2 minutes more.
7. Add minced garlic and cook for 30 seconds.
8. Add apple cider, Dijon mustard, and fresh thyme.
9. Bring to a simmer and cook until reduced by half, about 5-7 minutes.
10. Stir in butter and season with salt and pepper.
11. Return pork chops to the skillet along with any accumulated juices.
12. Simmer for 1-2 minutes to reheat.
13. Serve pork chops topped with apple cider sauce.', 4, 'autumn', 'system'),

('Stuffed Acorn Squash', 'Roasted acorn squash halves filled with a savory mixture of wild rice, sausage, and autumn fruits.', 30, 45,
'1. Preheat oven to 190°C.
2. Cut acorn squash in half and scoop out seeds.
3. Brush cut sides with olive oil and season with salt and pepper.
4. Place cut-side down on a baking sheet and roast until tender, about 30-35 minutes.
5. Meanwhile, cook wild rice according to package instructions.
6. In a large skillet, cook sausage until browned, breaking it up as it cooks.
7. Add diced onion, diced celery, and diced apple.
8. Cook until vegetables are softened, about 5-7 minutes.
9. Add minced garlic and cook for 30 seconds.
10. Stir in cooked wild rice, dried cranberries, chopped toasted pecans, chopped fresh herbs, salt, and pepper.
11. Turn squash halves cut-side up and fill with rice mixture.
12. Return to oven and bake for 10-15 minutes more.
13. Serve hot, garnished with additional fresh herbs.', 4, 'autumn', 'system');

-- Autumn Dessert Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Apple Crisp', 'Warm spiced apples topped with a crispy oat topping.', 20, 45,
'1. Preheat oven to 180°C.
2. In a large bowl, toss sliced apples with lemon juice, sugar, cinnamon, nutmeg, and cornstarch.
3. Transfer to a baking dish.
4. In another bowl, combine oats, flour, brown sugar, cinnamon, and salt.
5. Cut in cold butter until mixture resembles coarse crumbs.
6. Sprinkle topping over apples.
7. Bake until fruit is bubbling and topping is golden, about 40-45 minutes.
8. Let cool slightly before serving.
9. Serve with vanilla ice cream if desired.', 8, 'autumn', 'system'),

('Pumpkin Cheesecake', 'Creamy cheesecake with warm pumpkin spices and a gingersnap crust.', 30, 60,
'1. Preheat oven to 160°C.
2. In a food processor, pulse gingersnap cookies until fine crumbs form.
3. Add melted butter and pulse to combine.
4. Press mixture into the bottom of a springform pan.
5. Bake crust for 10 minutes, then let cool.
6. In a large bowl, beat cream cheese and sugar until smooth.
7. Add pumpkin puree, eggs, vanilla, cinnamon, nutmeg, ginger, and cloves.
8. Beat until well combined.
9. Pour filling over crust.
10. Bake until center is just set, about 50-60 minutes.
11. Turn off oven, crack the door, and let cheesecake cool in oven for 1 hour.
12. Refrigerate until completely chilled, at least 4 hours or overnight.
13. Serve with whipped cream if desired.', 12, 'autumn', 'system'),

('Poached Pears in Red Wine', 'Elegant poached pears in a spiced red wine syrup.', 15, 30,
'1. In a large pot, combine red wine, sugar, cinnamon stick, star anise, cloves, and orange zest.
2. Bring to a simmer, stirring to dissolve sugar.
3. Peel pears, leaving stems intact.
4. Add pears to wine mixture.
5. Simmer gently until pears are tender when pierced with a knife, about 20-30 minutes.
6. Remove pears and set aside.
7. Increase heat and boil wine mixture until reduced and syrupy, about 10-15 minutes.
8. Serve pears with reduced wine syrup.
9. Garnish with a dollop of mascarpone or crème fraîche if desired.', 4, 'autumn', 'system'),

('Pumpkin Bread Pudding', 'A warm, comforting dessert with pumpkin and warm spices.', 20, 45,
'1. Preheat oven to 180°C.
2. Butter a baking dish.
3. In a large bowl, whisk together eggs, pumpkin puree, milk, cream, sugar, vanilla, cinnamon, nutmeg, ginger, and salt.
4. Add cubed bread and toss to coat.
5. Let sit for 15 minutes to allow bread to absorb liquid.
6. Transfer to prepared baking dish.
7. Bake until set and golden, about 40-45 minutes.
8. Meanwhile, make the sauce: in a small saucepan, combine brown sugar, butter, and cream.
9. Bring to a simmer and cook until slightly thickened, about 5 minutes.
10. Stir in vanilla and a pinch of salt.
11. Serve bread pudding warm, drizzled with sauce.', 8, 'autumn', 'system');

-- Link Autumn Recipes to Ingredients
-- Pumpkin Spice Pancakes
INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Flour' AND user_id = 'system'), 200),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Pumpkin' AND user_id = 'system'), 150),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Egg' AND user_id = 'system'), 2),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Milk' AND user_id = 'system'), 200),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Cinnamon' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Nutmeg' AND user_id = 'system'), 2),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Baking powder' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Butter' AND user_id = 'system'), 30),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Maple syrup' AND user_id = 'system'), 50);

-- Butternut Squash Soup
INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Butternut squash' AND user_id = 'system'), 800),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Onion' AND user_id = 'system'), 1),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Apple' AND user_id = 'system'), 1),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Garlic' AND user_id = 'system'), 2),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Vegetable stock' AND user_id = 'system'), 1000),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Cream' AND user_id = 'system'), 100),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Olive oil' AND user_id = 'system'), 15),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Cinnamon' AND user_id = 'system'), 2),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Nutmeg' AND user_id = 'system'), 1),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Salt' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Black pepper' AND user_id = 'system'), 2);

-- Link Autumn Recipes to Kitchen Tools
-- Pumpkin Spice Pancakes
INSERT OR IGNORE INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Saladier')),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Fouet')),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Poêle')),
((SELECT id FROM recipes WHERE name = 'Pumpkin Spice Pancakes' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Spatule'));

-- Butternut Squash Soup
INSERT OR IGNORE INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Casserole')),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Couteau')),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Planche à découper')),
((SELECT id FROM recipes WHERE name = 'Butternut Squash Soup' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Immersion blender'));