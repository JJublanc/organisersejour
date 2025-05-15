-- Migration to create the new meal_components table

CREATE TABLE meal_components (
    id SERIAL PRIMARY KEY,
    meal_id INTEGER NOT NULL,
    course_type TEXT CHECK(course_type IN ('starter', 'main', 'dessert', 'side', 'extra', 'breakfast_item')) NOT NULL, -- Course/category
    recipe_id INTEGER, -- FK to recipes, NULLABLE
    ingredient_id INTEGER, -- FK to ingredients, NULLABLE
    quantity REAL, -- Used only for direct ingredients (assumed to be for the whole group)
    notes TEXT, -- Optional notes, e.g., "pour accompagner"
    display_order INTEGER NOT NULL DEFAULT 0, -- For ordering within a course/meal

    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL, -- Keep component if recipe deleted? Or CASCADE? Let's SET NULL for now.
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT, -- Prevent deleting ingredient if used directly

    -- Ensure either a recipe OR an ingredient is linked, but not both
    CONSTRAINT chk_component_type CHECK (
        (recipe_id IS NOT NULL AND ingredient_id IS NULL AND quantity IS NULL) -- Recipe link
        OR
        (recipe_id IS NULL AND ingredient_id IS NOT NULL AND quantity IS NOT NULL) -- Direct ingredient link
    )
);

-- Index for faster lookup by meal
CREATE INDEX idx_meal_components_meal_id ON meal_components(meal_id);