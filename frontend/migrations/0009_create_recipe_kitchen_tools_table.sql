-- Migration to create the recipe_kitchen_tools join table
CREATE TABLE recipe_kitchen_tools (
  recipe_id INTEGER NOT NULL,
  tool_id INTEGER NOT NULL,
  PRIMARY KEY (recipe_id, tool_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (tool_id) REFERENCES kitchen_tools(id) ON DELETE RESTRICT -- Prevent deleting tool if used in recipe
);