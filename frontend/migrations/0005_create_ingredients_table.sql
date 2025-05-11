-- Migration to create the ingredients table
CREATE TABLE ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL -- e.g., 'g', 'kg', 'ml', 'l', 'pcs', 'unit'
);