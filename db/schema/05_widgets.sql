-- Drop and recreate Widgets table (Example)

DROP TABLE IF EXISTS widgets CASCADE;
CREATE TABLE widgets (
  id SERIAL PRIMARY KEY NOT NULL,
  category VARCHAR(20) NOT NULL,
  item VARCHAR(225) NOT NULL
);

DROP TABLE IF EXISTS lists CASCADE;
CREATE TABLE lists (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ,
  widget_id INTEGER REFERENCES widgets(id)
);
