-- Si la table existe déjà, la supprimer
DROP TABLE IF EXISTS messages;

-- Créer la table "messages" sans contrainte NOT NULL sur la colonne content
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT
);

-- Insérer des données par défaut dans la table "messages"
INSERT INTO messages (content) VALUES ('Hello from D1 🎉');


