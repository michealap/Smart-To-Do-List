-- Drop and recreate Widgets table (Example)

DROP TABLE IF EXISTS queries CASCADE;
CREATE TABLE queries (
  id SERIAL PRIMARY KEY NOT NULL,
  category VARCHAR(20) NOT NULL,
  item VARCHAR(225) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);

