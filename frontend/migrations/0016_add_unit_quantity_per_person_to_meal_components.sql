-- Migration to add unit and quantity_per_person to meal_components
-- and adjust constraints for direct ingredients.

-- Using the recreate table method for compatibility and to handle constraint changes.

PRAGMA foreign_keys=off; -- Disable foreign key checks temporarily

BEGIN TRANSACTION;

-- 1. Create a new table with the desired structure
CREATE TABLE meal_components_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    meal_id INTEGER NOT NULL,
    course_type TEXT CHECK(course_type IN ('starter', 'main', 'dessert', 'side', 'extra', 'breakfast_item')) NOT NULL,
    recipe_id INTEGER,
    ingredient_id INTEGER,
    total_quantity REAL, -- Renamed from quantity, now nullable
    unit TEXT, -- New column
    quantity_per_person REAL, -- New column
    notes TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,

    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE RESTRICT,

    -- Updated constraint: Direct ingredients need unit and quantity_per_person
    CONSTRAINT chk_component_type CHECK (
        (recipe_id IS NOT NULL AND ingredient_id IS NULL AND total_quantity IS NULL AND unit IS NULL AND quantity_per_person IS NULL) -- Recipe link
        OR
        (recipe_id IS NULL AND ingredient_id IS NOT NULL AND unit IS NOT NULL AND quantity_per_person IS NOT NULL) -- Direct ingredient link
    )
);

-- 2. Copy data from the old table to the new table
-- Set default 'unit' to 'unité' and quantity_per_person to the old quantity for existing direct ingredients.
-- This makes an assumption about the meaning of the old 'quantity'. Manual adjustment might be needed later.
INSERT INTO meal_components_new (id, meal_id, course_type, recipe_id, ingredient_id, total_quantity, unit, quantity_per_person, notes, display_order)
SELECT
    id,
    meal_id,
    course_type,
    recipe_id,
    ingredient_id,
    CASE WHEN ingredient_id IS NOT NULL THEN NULL ELSE quantity END, -- Set total_quantity to NULL for direct ingredients being migrated
    CASE WHEN ingredient_id IS NOT NULL THEN 'unité' ELSE NULL END, -- Default unit for existing direct ingredients
    CASE WHEN ingredient_id IS NOT NULL THEN quantity ELSE NULL END, -- Use old quantity as quantity_per_person for existing
    notes,
    display_order
FROM meal_components;


-- 3. Drop the old table
DROP TABLE meal_components;

-- 4. Rename the new table to the original name
ALTER TABLE meal_components_new RENAME TO meal_components;

-- 5. Recreate indexes
CREATE INDEX idx_meal_components_meal_id ON meal_components(meal_id); -- Recreate index from migration 0015

COMMIT;

PRAGMA foreign_keys=on; -- Re-enable foreign key checks