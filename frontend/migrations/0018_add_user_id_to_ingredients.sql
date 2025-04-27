-- Migration to add user_id column to ingredients table
ALTER TABLE ingredients ADD COLUMN user_id TEXT NOT NULL DEFAULT 'dev-user';
CREATE INDEX idx_ingredients_user_id ON ingredients(user_id);