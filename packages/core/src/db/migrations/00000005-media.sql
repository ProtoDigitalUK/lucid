CREATE TABLE IF NOT EXISTS lucid_media (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  e_tag TEXT,

  mime_type TEXT NOT NULL,
  file_extension TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  name TEXT NOT NULL,
  alt TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);