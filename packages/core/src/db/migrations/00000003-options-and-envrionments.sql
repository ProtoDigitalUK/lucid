-- SITE OPTIONS TABLE
CREATE TABLE IF NOT EXISTS lucid_options (
  option_name TEXT UNIQUE NOT NULL PRIMARY KEY,
  option_value TEXT NOT NULL,
  type TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO lucid_options (option_name, option_value, type) VALUES ('media_storage_used', '0', 'number');

-- ENVIRONMENTS TABLE
CREATE TABLE IF NOT EXISTS lucid_environments (
  key TEXT PRIMARY KEY,

  title TEXT,
  assigned_bricks TEXT[],
  assigned_collections TEXT[],
  assigned_forms TEXT[]
);
