-- Migration to create the meal_recipes join table
CREATE TABLE meal_recipes (
  meal_id INTEGER NOT NULL,
  recipe_id INTEGER NOT NULL,
  PRIMARY KEY (meal_id, recipe_id),
  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE, -- If a meal is deleted, the link is removed
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE -- If a recipe is deleted, the link is removed
);