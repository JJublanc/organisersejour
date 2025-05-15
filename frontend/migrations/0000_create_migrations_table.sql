-- Migration to create the table for tracking applied migrations

CREATE TABLE IF NOT EXISTS applied_migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);