-- Migration number: 0001 	 2025-04-13T06:55:59.862Z
-- migrations/0000_init.sql

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL
);
INSERT INTO messages (content) VALUES ('Hello from D1 🎉');