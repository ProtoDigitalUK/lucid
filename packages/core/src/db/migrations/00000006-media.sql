CREATE TABLE IF NOT EXISTS lucid_media (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  e_tag TEXT,

  type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_extension TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,

  name_translation_key_id INTEGER REFERENCES lucid_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
  alt_translation_key_id INTEGER REFERENCES lucid_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lucid_processed_images (
  key TEXT NOT NULL PRIMARY KEY,
  media_key TEXT REFERENCES lucid_media(key) ON DELETE SET NULL ON UPDATE CASCADE
)