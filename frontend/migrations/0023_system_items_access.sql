-- Migration to document changes made to ensure system items are accessible but not deletable
-- This migration doesn't actually modify the database schema, but documents the changes made to the application code

-- The following endpoints were modified to allow all users to access system-provided items:
-- 1. frontend/src/routes/recipes/+page.server.ts
-- 2. frontend/src/routes/ingredients/+page.server.ts
-- 3. frontend/src/routes/api/recipes/+server.ts
-- 4. frontend/src/routes/api/ingredients/+server.ts

-- The following endpoints were modified to prevent deletion of system-provided items:
-- 1. frontend/src/routes/api/recipes/+server.ts
-- 2. frontend/src/routes/api/ingredients/+server.ts
-- 3. frontend/src/routes/api/kitchen_tools/+server.ts

-- Changes made:
-- 1. Modified queries to fetch both user's items and system items (user_id = ? OR user_id = 'system')
-- 2. Added checks to prevent deletion of items where user_id = 'system'
-- 3. Added checks to prevent deletion of kitchen tools used by system recipes

-- No actual schema changes were made, this is just documentation.