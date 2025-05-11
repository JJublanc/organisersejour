
-- List all system ingredients
SELECT
  id,
  COALESCE(french_name, name) as name,
  unit,
  type,
  season
FROM ingredients
WHERE user_id = 'system'
ORDER BY type, name;

-- List all kitchen tools
SELECT
  id,
  name
FROM kitchen_tools
ORDER BY name;

-- List all system recipes
SELECT
  id,
  COALESCE(french_name, name) as name,
  description,
  servings,
  season
FROM recipes
WHERE user_id = 'system'
ORDER BY name;
