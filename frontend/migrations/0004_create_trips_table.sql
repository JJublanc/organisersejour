-- Migration to create the trips table
CREATE TABLE trips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_date TEXT NOT NULL, -- Store dates as ISO 8601 strings (YYYY-MM-DD)
  end_date TEXT NOT NULL,   -- Store dates as ISO 8601 strings (YYYY-MM-DD)
  location TEXT,
  organiser_id TEXT NOT NULL, -- User ID from authentication (e.g., JWT sub claim)
  num_people INTEGER NOT NULL DEFAULT 1 -- Number of people attending the trip
);