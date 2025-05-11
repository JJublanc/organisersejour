-- Add season column to recipes table
ALTER TABLE recipes ADD COLUMN season TEXT CHECK (season IN ('spring', 'summer', 'autumn', 'winter', NULL));

-- Update the comment on the table to include the new column
PRAGMA foreign_keys=off;
BEGIN TRANSACTION;

-- Add a comment explaining the season values
PRAGMA table_info(recipes);

-- End transaction
COMMIT;
PRAGMA foreign_keys=on;

-- Valid seasons: 'spring', 'summer', 'autumn', 'winter'