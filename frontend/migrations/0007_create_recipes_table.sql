-- Migration to create the recipes table
CREATE TABLE recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT, -- Optional description of the recipe
  prep_time_minutes INTEGER, -- Preparation time in minutes
  cook_time_minutes INTEGER, -- Cooking time in minutes
  instructions TEXT, -- Step-by-step instructions
  servings INTEGER NOT NULL DEFAULT 1 -- Base number of people the recipe serves
);