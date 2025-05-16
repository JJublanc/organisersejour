-- Migration to add user_id column to recipes table
ALTER TABLE recipes ADD COLUMN user_id TEXT NOT NULL DEFAULT 'dev-user';
CREATE INDEX idx_recipes_user_id ON recipes(user_id);