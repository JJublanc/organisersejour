-- Migration to create the meals table
CREATE TABLE meals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trip_day_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('breakfast', 'lunch', 'dinner')), -- Type of meal
  drinks TEXT, -- Optional description of drinks
  bread BOOLEAN NOT NULL DEFAULT 0, -- Whether bread is included (0=false, 1=true)
  FOREIGN KEY (trip_day_id) REFERENCES trip_days(id) ON DELETE CASCADE -- If a trip day is deleted, its meals are also deleted
);

-- Optional: Add an index for faster lookup of meals by trip_day_id
CREATE INDEX idx_meals_trip_day_id ON meals(trip_day_id);