-- Add season column to ingredients table
ALTER TABLE ingredients ADD COLUMN season TEXT CHECK (season IN ('spring', 'summer', 'autumn', 'winter', NULL));

-- Update the comment on the table to include the new column

-- Add a comment explaining the season values


-- Valid seasons: 'spring', 'summer', 'autumn', 'winter'