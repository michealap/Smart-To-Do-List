-- Drop and recreate Widgets table (Example)

DROP TABLE IF EXISTS widgets CASCADE;
CREATE TABLE widgets (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTERGER REFERENCES users(id) ON DELETE CASCADE
  item VARCHAR(225) NOT NULL,
  category VARCHAR(20) NOT NULL
);


