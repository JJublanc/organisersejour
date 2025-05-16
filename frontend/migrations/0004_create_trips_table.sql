-- Migration to create the trips table
CREATE TABLE trips (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT,
  organiser_id TEXT NOT NULL, -- User ID from authentication (e.g., JWT sub claim)
  num_people INTEGER NOT NULL DEFAULT 1 -- Number of people attending the trip
);