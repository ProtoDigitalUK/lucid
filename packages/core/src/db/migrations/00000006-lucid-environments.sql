CREATE TABLE IF NOT EXISTS lucid_environments (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,

  title TEXT NOT NULL,
  assigned_bricks TEXT[] NOT NULL
  assigned_collections TEXT[] NOT NULL
);
