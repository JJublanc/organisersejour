-- Migration to create the kitchen_tools table
CREATE TABLE kitchen_tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE -- e.g., 'Mixing Bowl', 'Oven', 'Whisk'
);