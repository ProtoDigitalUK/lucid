CREATE TABLE IF NOT EXISTS headless_form_submissions (
  id SERIAL PRIMARY KEY,
  form_key TEXT NOT NULL, -- referneces formbuilder instance
  environment_key TEXT NOT NULL REFERENCES headless_environments(key) ON DELETE CASCADE,

  read_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS headless_form_data (
  id SERIAL PRIMARY KEY,
  form_submission_id INTEGER NOT NULL REFERENCES headless_form_submissions(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  text_value TEXT,
  number_value NUMERIC,
  boolean_value BOOLEAN,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
