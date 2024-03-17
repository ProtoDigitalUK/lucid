CREATE TABLE IF NOT EXISTS headless_media (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  e_tag TEXT,
  visible BOOLEAN NOT NULL DEFAULT TRUE,

  type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_extension TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,

  title_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
  alt_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS headless_processed_images (
  key TEXT NOT NULL PRIMARY KEY,
  media_key TEXT REFERENCES headless_media(key) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_media_key ON headless_processed_images(media_key);