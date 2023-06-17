CREATE TABLE IF NOT EXISTS lucid_environments (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,

  title TEXT,
  assigned_bricks TEXT[],
  assigned_collections TEXT[]
);
