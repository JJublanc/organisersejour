-- Add season column to ingredients table
ALTER TABLE ingredients ADD COLUMN season TEXT CHECK (season IN ('spring', 'summer', 'autumn', 'winter', NULL));

-- Update the comment on the table to include the new column
PRAGMA foreign_keys=off;

-- Add a comment explaining the season values
PRAGMA table_info(ingredients);

PRAGMA foreign_keys=on;

-- Valid seasons: 'spring', 'summer', 'autumn', 'winter'