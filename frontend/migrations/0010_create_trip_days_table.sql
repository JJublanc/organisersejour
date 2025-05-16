-- Migration to create the trip_days table
CREATE TABLE trip_days (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL,
  date DATE NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE -- If a trip is deleted, its days are also deleted
);

-- Optional: Add an index for faster lookup of days by trip_id
CREATE INDEX idx_trip_days_trip_id ON trip_days(trip_id);