
CREATE TABLE IF NOT EXISTS headless_languages (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- ISO 639-1 - bcp47
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO headless_languages (code, is_default)
VALUES ('en', TRUE)
ON CONFLICT (code) 
DO UPDATE SET is_default = TRUE;

CREATE TABLE IF NOT EXISTS headless_translation_keys (
  id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS headless_translations (
  id SERIAL PRIMARY KEY,
  translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE CASCADE ON UPDATE CASCADE,
  language_id INTEGER REFERENCES headless_languages(id) ON DELETE CASCADE ON UPDATE CASCADE,
  value TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (translation_key_id, language_id)
);

CREATE INDEX idx_translation_key_language
ON headless_translations(translation_key_id, language_id);

-- Create a trigger function to enforce a single default language
CREATE OR REPLACE FUNCTION enforce_single_default_language() 
RETURNS TRIGGER AS $$
BEGIN
    -- If the is_default field is set to TRUE for the new/updated row
    IF NEW.is_default THEN
        -- Set is_default to FALSE for all other rows in the table
        UPDATE headless_languages
        SET is_default = FALSE
        WHERE is_default AND id <> NEW.id;
    END IF;
    -- Return the new row to proceed with the insertion/update
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to invoke the function before INSERT on headless_languages
DROP TRIGGER IF EXISTS single_default_language_insert_trigger ON headless_languages;
CREATE TRIGGER single_default_language_insert_trigger 
BEFORE INSERT ON headless_languages
FOR EACH ROW 
WHEN (NEW.is_default)
EXECUTE PROCEDURE enforce_single_default_language();

-- Create a trigger to invoke the function before UPDATE on headless_languages
DROP TRIGGER IF EXISTS single_default_language_update_trigger ON headless_languages;
CREATE TRIGGER single_default_language_update_trigger 
BEFORE UPDATE OF is_default ON headless_languages
FOR EACH ROW 
WHEN (NEW.is_default IS DISTINCT FROM OLD.is_default)
EXECUTE PROCEDURE enforce_single_default_language();