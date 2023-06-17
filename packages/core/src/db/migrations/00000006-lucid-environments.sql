CREATE TABLE IF NOT EXISTS lucid_environments (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,

  title TEXT NOT NULL,
  allowed_bricks TEXT[] NOT NULL
);
