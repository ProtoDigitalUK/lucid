CREATE TABLE IF NOT EXISTS headless_environments (
  key TEXT PRIMARY KEY,
  title TEXT
);

CREATE TABLE IF NOT EXISTS headless_assigned_bricks (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    environment_key TEXT REFERENCES headless_environments(key) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS headless_assigned_collections (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL,
    environment_key TEXT REFERENCES headless_environments(key) ON DELETE CASCADE
);