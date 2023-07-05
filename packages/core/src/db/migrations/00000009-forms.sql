
CREATE TABLE IF NOT EXISTS lucid_forms (
  key TEXT PRIMARY KEY,
  environment_key TEXT NOT NULL REFERENCES lucid_environments(key) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lucid_forms_data (
  id SERIAL PRIMARY KEY,
  forms_key TEXT NOT NULL REFERENCES lucid_forms(key) ON DELETE CASCADE,

  name TEXT NOT NULL,
  text_value TEXT,
  number_value NUMERIC,
  boolean_value BOOLEAN,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
