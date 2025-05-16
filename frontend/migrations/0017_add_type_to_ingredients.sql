-- Migration to add type column to ingredients table
ALTER TABLE ingredients ADD COLUMN type TEXT NOT NULL DEFAULT 'autre';

-- Update the comment on the table to include the new column

-- Add a comment explaining the type values


-- Valid types: 'boisson', 'pain', 'condiment', 'légume', 'fruit', 'viande', 'poisson', 'autre'