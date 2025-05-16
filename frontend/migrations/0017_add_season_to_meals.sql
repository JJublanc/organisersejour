-- Add season column to meals table
ALTER TABLE meals ADD COLUMN season TEXT CHECK (season IN ('spring', 'summer', 'autumn', 'winter', NULL));