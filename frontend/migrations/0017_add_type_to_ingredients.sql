-- Migration to add type column to ingredients table
ALTER TABLE ingredients ADD COLUMN type TEXT NOT NULL DEFAULT 'autre';

-- Update the comment on the table to include the new column
PRAGMA foreign_keys=off;

-- Add a comment explaining the type values
PRAGMA table_info(ingredients);

PRAGMA foreign_keys=on;

-- Valid types: 'boisson', 'pain', 'condiment', 'légume', 'fruit', 'viande', 'poisson', 'autre'