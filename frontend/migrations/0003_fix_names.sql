-- Migration number: 0003 	 2025-04-13T07:17:41.951Z
-- Si la table existe déjà, la supprimer
DROP TABLE IF EXISTS messages;

-- Créer la table "messages" sans contrainte NOT NULL sur la colonne content
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT
);

-- Insérer des données par défaut dans la table "messages"
INSERT INTO messages (text) VALUES ('Hello from D1 🎉');