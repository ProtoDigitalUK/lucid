CREATE TABLE IF NOT EXISTS headless_languages (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS headless_translation_keys (
  id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS headless_translations (
  id SERIAL PRIMARY KEY,
  translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE CASCADE ON UPDATE CASCADE,
  language_id INTEGER REFERENCES headless_languages(id) ON DELETE CASCADE ON UPDATE CASCADE,
  value TEXT,

  UNIQUE (translation_key_id, language_id)
);

CREATE INDEX IF NOT EXISTS idx_translation_key_language
ON headless_translations(translation_key_id, language_id);