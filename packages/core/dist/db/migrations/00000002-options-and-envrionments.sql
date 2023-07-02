-- SITE OPTIONS TABLE
CREATE TABLE IF NOT EXISTS lucid_options (
  option_name TEXT UNIQUE NOT NULL PRIMARY KEY,
  option_value TEXT NOT NULL,
  type TEXT NOT NULL,
  locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- inset initial_user_created flag
INSERT INTO lucid_options (option_name, option_value, type, locked) VALUES ('initial_user_created', 'false', 'boolean', false);
INSERT INTO lucid_options (option_name, option_value, type, locked) VALUES ('media_storage_used', '0', 'number', false);

-- ENVIRONMENTS TABLE
CREATE TABLE IF NOT EXISTS lucid_environments (
  key TEXT PRIMARY KEY,

  title TEXT,
  assigned_bricks TEXT[],
  assigned_collections TEXT[]
);
