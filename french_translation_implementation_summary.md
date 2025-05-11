# Implémentation des Traductions en Français

Ce document résume l'implémentation des traductions en français pour les recettes, ingrédients et ustensiles de cuisine.

## 1. Approche

Après avoir rencontré des problèmes avec la méthode de mise à jour directe des noms (contrainte UNIQUE), nous avons opté pour une approche différente :

1. Ajouter une colonne `french_name` aux tables concernées
2. Remplir cette colonne avec les traductions françaises
3. Modifier le code de l'application pour utiliser la colonne `french_name` en priorité

## 2. Migrations SQL

Nous avons créé les migrations suivantes :

- `0024_add_french_names.sql` : Ajoute la colonne `french_name` aux tables recipes, ingredients et kitchen_tools
- `0025_populate_french_names_part1.sql` : Remplit les noms français pour les ustensiles et les ingrédients de printemps/été
- `0025_populate_french_names_part2.sql` : Remplit les noms français pour les ingrédients d'automne/hiver et les ingrédients communs
- `0025_populate_french_names_part3.sql` : Remplit les noms français pour les recettes et met à jour les saisons

## 3. Modifications du Code

Nous avons modifié les endpoints suivants pour utiliser la colonne `french_name` :

### Pages serveur

- `frontend/src/routes/recipes/+page.server.ts`
- `frontend/src/routes/ingredients/+page.server.ts`

### API endpoints

- `frontend/src/routes/api/recipes/+server.ts`
- `frontend/src/routes/api/ingredients/+server.ts`
- `frontend/src/routes/api/kitchen_tools/+server.ts`

Dans chaque cas, nous avons utilisé la fonction `COALESCE(french_name, name)` pour afficher le nom français s'il existe, sinon le nom anglais.

## 4. Script d'Application

Nous avons créé un script shell `apply_translations.sh` qui applique les migrations dans le bon ordre :

1. Ajoute les colonnes `french_name`
2. Remplit les noms français pour les ustensiles et les ingrédients de printemps/été
3. Remplit les noms français pour les ingrédients d'automne/hiver et les ingrédients communs
4. Remplit les noms français pour les recettes et met à jour les saisons

## 5. Résultat

Grâce à ces modifications :

- Toutes les recettes, ingrédients et ustensiles de cuisine sont affichés en français
- Les saisons sont également traduites (printemps, été, automne, hiver)
- Le code original reste intact, ce qui facilite la maintenance
- L'approche est extensible pour d'autres langues à l'avenir

Pour appliquer les traductions, exécutez le script :

```bash
cd frontend
./apply_translations.sh