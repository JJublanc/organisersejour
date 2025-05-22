-- Migration to create the kitchen_tools table
CREATE TABLE kitchen_tools (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE -- e.g., 'Mixing Bowl', 'Oven', 'Whisk'
);