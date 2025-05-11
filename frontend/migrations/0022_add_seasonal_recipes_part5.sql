-- Migration to add seasonal recipes and ingredients (Part 5 - Winter Recipes)
-- This part adds winter recipes and their connections to ingredients and kitchen tools

-- 7. Add Winter Recipes

-- Winter Breakfast Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Cranberry Orange Oatmeal', 'Warming oatmeal with winter fruits and spices.', 5, 10,
'1. In a saucepan, combine oats, milk, water, cinnamon, and a pinch of salt.
2. Bring to a simmer over medium heat.
3. Cook, stirring occasionally, until oats are tender and mixture is creamy, about 5-7 minutes.
4. Stir in dried cranberries and orange zest.
5. Remove from heat and let stand for 2 minutes.
6. Serve topped with a drizzle of honey or maple syrup, chopped nuts, and fresh orange segments if desired.', 2, 'winter', 'system'),

('Winter Citrus Breakfast Parfait', 'Layers of yogurt, granola, and fresh winter citrus.', 10, 0,
'1. Peel and segment oranges, grapefruits, and clementines.
2. In glasses or bowls, layer yogurt, granola, and citrus segments.
3. Drizzle with honey.
4. Top with a sprinkle of chopped pistachios or almonds.
5. Serve immediately or refrigerate for up to 2 hours.', 2, 'winter', 'system'),

('Spiced Apple Baked Oatmeal', 'A hearty baked oatmeal with winter spices and apples.', 15, 35,
'1. Preheat oven to 180°C.
2. Butter a baking dish.
3. In a large bowl, combine oats, baking powder, cinnamon, nutmeg, ginger, and salt.
4. In another bowl, whisk together milk, eggs, maple syrup, vanilla, and melted butter.
5. Stir wet ingredients into dry ingredients.
6. Fold in diced apple and chopped nuts.
7. Pour into prepared baking dish.
8. Bake until set and golden, about 30-35 minutes.
9. Let cool slightly before serving.
10. Serve with additional milk or yogurt if desired.', 6, 'winter', 'system'),

('Winter Vegetable Frittata', 'A hearty frittata with winter vegetables and cheese.', 15, 20,
'1. Preheat oven to 180°C.
2. Heat olive oil in an oven-safe skillet over medium heat.
3. Add diced sweet potato and cook until beginning to soften, about 5 minutes.
4. Add sliced leeks and cook until softened, about 3 minutes.
5. Add chopped kale and cook until wilted, about 2 minutes.
6. In a bowl, whisk eggs with salt, pepper, and a splash of milk.
7. Pour egg mixture over vegetables.
8. Cook until edges are set, about 3 minutes.
9. Sprinkle with crumbled goat cheese.
10. Transfer to oven and bake until fully set, about 10-12 minutes.
11. Let cool slightly before slicing and serving.', 4, 'winter', 'system');

-- Winter Lunch Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('White Bean and Kale Soup', 'A hearty, nutritious soup perfect for cold winter days.', 15, 30,
'1. Heat olive oil in a large pot over medium heat.
2. Add diced onion, diced carrot, and diced celery.
3. Cook until vegetables are softened, about 5-7 minutes.
4. Add minced garlic and cook for 30 seconds.
5. Add chopped kale and cook until wilted, about 3 minutes.
6. Add drained and rinsed white beans, vegetable or chicken stock, bay leaf, thyme, salt, and pepper.
7. Bring to a simmer and cook for 15-20 minutes.
8. Remove bay leaf and thyme sprigs.
9. Using an immersion blender, partially blend the soup, leaving some texture.
10. Stir in lemon juice.
11. Serve hot, drizzled with olive oil and sprinkled with grated Parmesan if desired.', 6, 'winter', 'system'),

('Winter Citrus Salad', 'A bright, refreshing salad featuring winter citrus fruits.', 15, 0,
'1. Segment oranges, grapefruits, and clementines.
2. Arrange citrus segments on a platter or individual plates.
3. Scatter thinly sliced fennel over citrus.
4. Sprinkle with pomegranate seeds and sliced avocado.
5. In a small bowl, whisk together olive oil, white wine vinegar, honey, Dijon mustard, salt, and pepper.
6. Drizzle dressing over salad.
7. Garnish with fresh mint leaves.
8. Serve immediately.', 4, 'winter', 'system'),

('Roasted Winter Vegetable Grain Bowl', 'A nutritious bowl with roasted winter vegetables and hearty grains.', 20, 35,
'1. Preheat oven to 200°C.
2. Toss diced sweet potato, Brussels sprouts, and cauliflower with olive oil, salt, and pepper.
3. Spread on a baking sheet and roast until tender and caramelized, about 25-30 minutes.
4. Meanwhile, cook farro or other grain according to package instructions.
5. In a small bowl, whisk together olive oil, lemon juice, tahini, minced garlic, salt, and pepper.
6. In bowls, arrange cooked grain and roasted vegetables.
7. Top with sliced avocado, pomegranate seeds, and toasted pumpkin seeds.
8. Drizzle with tahini dressing.
9. Garnish with fresh herbs.
10. Serve warm.', 4, 'winter', 'system'),

('French Onion Soup', 'A classic, comforting soup with caramelized onions and melted cheese.', 20, 60,
'1. In a large pot, melt butter over medium heat.
2. Add thinly sliced onions and cook, stirring occasionally, until deeply caramelized, about 30-40 minutes.
3. Add minced garlic and cook for 30 seconds.
4. Add flour and cook, stirring, for 1 minute.
5. Add beef stock, white wine, thyme, bay leaf, salt, and pepper.
6. Bring to a simmer and cook for 15-20 minutes.
7. Meanwhile, preheat broiler.
8. Ladle soup into oven-safe bowls.
9. Top each with a slice of toasted baguette and grated Gruyère cheese.
10. Place under broiler until cheese is melted and bubbly, about 2-3 minutes.
11. Serve hot.', 4, 'winter', 'system'),

('Winter Panzanella', 'A winter version of the classic Italian bread salad.', 20, 25,
'1. Preheat oven to 200°C.
2. Toss bread cubes with olive oil, salt, and pepper.
3. Spread on a baking sheet and toast until golden, about 10-15 minutes.
4. Meanwhile, toss diced butternut squash with olive oil, salt, and pepper.
5. Spread on another baking sheet and roast until tender, about 20-25 minutes.
6. In a large bowl, combine toasted bread, roasted squash, thinly sliced red onion, chopped kale, and crumbled feta.
7. In a small bowl, whisk together olive oil, balsamic vinegar, Dijon mustard, minced garlic, salt, and pepper.
8. Pour dressing over salad and toss gently.
9. Let sit for 10 minutes before serving to allow bread to absorb dressing.
10. Serve at room temperature.', 4, 'winter', 'system');

-- Winter Dinner Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Slow-Cooked Beef Bourguignon', 'A rich, hearty stew perfect for cold winter nights.', 30, 180,
'1. Season beef cubes with salt and pepper.
2. Heat oil in a large Dutch oven over high heat.
3. Working in batches, brown beef on all sides. Transfer to a plate.
4. Reduce heat to medium and add diced bacon. Cook until crisp.
5. Add chopped onion and sliced carrots. Cook until softened, about 5-7 minutes.
6. Add minced garlic and cook for 30 seconds.
7. Add tomato paste and cook, stirring, for 1 minute.
8. Add red wine and scrape up any browned bits from the bottom of the pot.
9. Return beef to the pot along with any accumulated juices.
10. Add beef stock, thyme, bay leaves, and pearl onions.
11. Bring to a simmer, then reduce heat to low.
12. Cover and cook for 2-2.5 hours, until beef is very tender.
13. In a separate pan, sauté mushrooms in butter until golden.
14. Add mushrooms to the stew.
15. In a small bowl, mash together butter and flour to form a paste.
16. Stir paste into stew and simmer until thickened, about 5 minutes.
17. Season with salt and pepper to taste.
18. Serve hot, garnished with fresh parsley.', 6, 'winter', 'system'),

('Duck Confit with Lentils', 'Tender duck confit served with earthy lentils.', 20, 30,
'1. Heat duck confit according to package instructions.
2. Meanwhile, rinse lentils and place in a pot with water or stock.
3. Add a bay leaf, thyme sprig, and half an onion.
4. Bring to a simmer and cook until tender but not mushy, about 20-25 minutes.
5. Drain lentils and discard bay leaf, thyme, and onion.
6. In a large skillet, heat olive oil over medium heat.
7. Add diced carrot, diced celery, and minced garlic.
8. Cook until vegetables are softened, about 5 minutes.
9. Add lentils, chopped fresh herbs, salt, and pepper.
10. In a small bowl, whisk together olive oil, red wine vinegar, Dijon mustard, salt, and pepper.
11. Pour dressing over lentils and toss gently.
12. Serve duck confit over lentils, garnished with additional fresh herbs.', 4, 'winter', 'system'),

('Winter Vegetable Shepherd''s Pie', 'A vegetarian version of the classic comfort food.', 30, 45,
'1. Preheat oven to 190°C.
2. In a large pot, cover diced potatoes with cold water.
3. Add salt and bring to a boil.
4. Cook until potatoes are tender, about 15 minutes.
5. Drain potatoes and return to pot.
6. Add butter, milk, salt, and pepper.
7. Mash until smooth and set aside.
8. In a large skillet, heat olive oil over medium heat.
9. Add chopped onion, diced carrot, and diced celery.
10. Cook until vegetables are softened, about 5-7 minutes.
11. Add minced garlic and cook for 30 seconds.
12. Add diced mushrooms and cook until they release their moisture and begin to brown, about 8-10 minutes.
13. Add diced parsnips and diced turnips.
14. Cook for 5 minutes more.
15. Stir in tomato paste, vegetable stock, thyme, rosemary, salt, and pepper.
16. Simmer until vegetables are tender and sauce has thickened, about 10 minutes.
17. Stir in frozen peas.
18. Transfer vegetable mixture to a baking dish.
19. Top with mashed potatoes, spreading to the edges.
20. Bake until filling is bubbling and top is golden, about 25-30 minutes.
21. Let cool slightly before serving.', 6, 'winter', 'system'),

('Citrus-Glazed Salmon', 'Salmon fillets with a bright winter citrus glaze.', 15, 15,
'1. Preheat oven to 200°C.
2. In a small saucepan, combine orange juice, lemon juice, honey, Dijon mustard, and minced garlic.
3. Bring to a simmer and cook until reduced and slightly thickened, about 5-7 minutes.
4. Season salmon fillets with salt and pepper.
5. Place salmon on a baking sheet lined with parchment paper.
6. Brush salmon with citrus glaze.
7. Bake until salmon is cooked through but still moist, about 12-15 minutes.
8. Meanwhile, toss sliced fennel and orange segments with olive oil, lemon juice, salt, and pepper.
9. Serve salmon over fennel-orange salad, drizzled with additional glaze.
10. Garnish with fresh herbs.', 4, 'winter', 'system'),

('Winter Squash Risotto', 'Creamy risotto with roasted winter squash and sage.', 20, 40,
'1. Preheat oven to 200°C.
2. Toss winter squash cubes with olive oil, salt, and pepper.
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
14. Serve immediately, garnished with additional Parmesan and fried sage leaves if desired.', 4, 'winter', 'system');

-- Winter Dessert Recipes
INSERT OR IGNORE INTO recipes (name, description, prep_time_minutes, cook_time_minutes, instructions, servings, season, user_id)
VALUES
('Orange Almond Cake', 'A moist, flourless cake with winter citrus.', 20, 60,
'1. Preheat oven to 180°C.
2. Butter and line a 23cm cake pan.
3. Place whole oranges in a pot and cover with water.
4. Bring to a boil, then reduce heat and simmer for 1 hour.
5. Drain oranges and let cool.
6. Cut oranges in half and remove any seeds.
7. Place oranges (with peel) in a food processor and blend until smooth.
8. In a large bowl, beat eggs and sugar until pale and thick.
9. Fold in orange puree, almond flour, and baking powder.
10. Pour batter into prepared pan.
11. Bake until a toothpick inserted in the center comes out clean, about 50-60 minutes.
12. Let cool in pan for 10 minutes, then transfer to a wire rack to cool completely.
13. Dust with powdered sugar before serving.', 12, 'winter', 'system'),

('Poached Pears in Spiced Wine', 'Elegant poached pears in a spiced red wine syrup.', 15, 30,
'1. In a large pot, combine red wine, sugar, cinnamon stick, star anise, cloves, and orange zest.
2. Bring to a simmer, stirring to dissolve sugar.
3. Peel pears, leaving stems intact.
4. Add pears to wine mixture.
5. Simmer gently until pears are tender when pierced with a knife, about 20-30 minutes.
6. Remove pears and set aside.
7. Increase heat and boil wine mixture until reduced and syrupy, about 10-15 minutes.
8. Serve pears with reduced wine syrup.
9. Garnish with a dollop of mascarpone or crème fraîche if desired.', 4, 'winter', 'system'),

('Cranberry Orange Bread Pudding', 'A warm, comforting dessert with winter fruits.', 20, 45,
'1. Preheat oven to 180°C.
2. Butter a baking dish.
3. In a large bowl, whisk together eggs, milk, cream, sugar, vanilla, cinnamon, and orange zest.
4. Add cubed bread and toss to coat.
5. Fold in dried cranberries and chopped candied orange peel.
6. Let sit for 15 minutes to allow bread to absorb liquid.
7. Transfer to prepared baking dish.
8. Bake until set and golden, about 40-45 minutes.
9. Meanwhile, make the sauce: in a small saucepan, combine orange juice, sugar, and butter.
10. Bring to a simmer and cook until slightly thickened, about 5 minutes.
11. Stir in Grand Marnier if using.
12. Serve bread pudding warm, drizzled with orange sauce.', 8, 'winter', 'system'),

('Chocolate Chestnut Torte', 'A rich, flourless chocolate cake with winter chestnuts.', 30, 40,
'1. Preheat oven to 170°C.
2. Butter and line a 23cm cake pan.
3. In a food processor, pulse cooked chestnuts until finely chopped.
4. In a heatproof bowl set over a pot of simmering water, melt chocolate and butter together.
5. Remove from heat and let cool slightly.
6. In a large bowl, whisk egg yolks and half the sugar until pale and thick.
7. Stir in melted chocolate mixture and chestnuts.
8. In another bowl, beat egg whites until soft peaks form.
9. Gradually add remaining sugar and beat until stiff peaks form.
10. Fold egg whites into chocolate mixture in three additions.
11. Pour batter into prepared pan.
12. Bake until cake is set but still slightly wobbly in the center, about 35-40 minutes.
13. Let cool completely in pan.
14. Dust with cocoa powder before serving.
15. Serve with whipped cream if desired.', 12, 'winter', 'system');

-- Link Winter Recipes to Ingredients
-- Slow-Cooked Beef Bourguignon
INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Beef for stew' AND user_id = 'system'), 800),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Bacon' AND user_id = 'system'), 100),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Red wine' AND user_id = 'system'), 300),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Beef stock' AND user_id = 'system'), 300),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Carrot' AND user_id = 'system'), 3),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Onion' AND user_id = 'system'), 2),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Garlic' AND user_id = 'system'), 3),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Mushroom' AND user_id = 'system'), 200),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Thyme' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Butter' AND user_id = 'system'), 30),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Flour' AND user_id = 'system'), 30),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Salt' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Black pepper' AND user_id = 'system'), 2);

-- White Bean and Kale Soup
INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Kale' AND user_id = 'system'), 200),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Dried beans' AND user_id = 'system'), 250),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Onion' AND user_id = 'system'), 1),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Carrot' AND user_id = 'system'), 2),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Celery' AND user_id = 'system'), 2),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Garlic' AND user_id = 'system'), 2),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Vegetable stock' AND user_id = 'system'), 1000),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Olive oil' AND user_id = 'system'), 15),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Lemon' AND user_id = 'system'), 1),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Salt' AND user_id = 'system'), 5),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM ingredients WHERE name = 'Black pepper' AND user_id = 'system'), 2);

-- Link Winter Recipes to Kitchen Tools
-- Slow-Cooked Beef Bourguignon
INSERT OR IGNORE INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Slow cooker')),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Couteau')),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Planche à découper')),
((SELECT id FROM recipes WHERE name = 'Slow-Cooked Beef Bourguignon' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Spatule'));

-- White Bean and Kale Soup
INSERT OR IGNORE INTO recipe_kitchen_tools (recipe_id, tool_id) VALUES
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Casserole')),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Couteau')),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Planche à découper')),
((SELECT id FROM recipes WHERE name = 'White Bean and Kale Soup' AND user_id = 'system'), (SELECT id FROM kitchen_tools WHERE name = 'Immersion blender'));