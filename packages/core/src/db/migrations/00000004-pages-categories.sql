-- PAGES TABLE - collection pages type
CREATE TABLE IF NOT EXISTS lucid_pages (
  id SERIAL PRIMARY KEY,
  environment_key TEXT NOT NULL REFERENCES lucid_environments(key) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES lucid_pages(id) ON DELETE SET NULL,
  collection_key TEXT NOT NULL,

  title TEXT NOT NULL,
  slug TEXT,
  full_slug TEXT, 
  homepage BOOLEAN DEFAULT FALSE,
  excerpt TEXT,
  
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  published_by INT REFERENCES lucid_users(id) ON DELETE SET NULL,

  created_by INT REFERENCES lucid_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- create full_slug
CREATE OR REPLACE FUNCTION update_full_slug() RETURNS trigger AS $$
DECLARE
    parent_full_slug TEXT;
BEGIN
    -- Get parent's full_slug
    SELECT full_slug INTO parent_full_slug FROM lucid_pages WHERE id = NEW.parent_id;
    
    -- Compute new full_slug for the updated/inserted row
    IF parent_full_slug IS NULL THEN
        NEW.full_slug := NEW.slug;
    ELSE
        NEW.full_slug := parent_full_slug || '/' || NEW.slug;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_full_slug_trigger ON lucid_pages;
CREATE TRIGGER update_full_slug_trigger BEFORE INSERT OR UPDATE ON lucid_pages
FOR EACH ROW EXECUTE PROCEDURE update_full_slug();

CREATE OR REPLACE FUNCTION update_child_full_slug() RETURNS trigger AS $$
BEGIN
    -- If it's an UPDATE operation and slug is changed
    IF OLD.slug != NEW.slug THEN
        -- Update children's full_slug
        UPDATE lucid_pages SET full_slug = NEW.full_slug || substring(full_slug, length(OLD.full_slug) + 1)
        WHERE full_slug LIKE OLD.full_slug || '/%';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_child_full_slug_trigger ON lucid_pages;
CREATE TRIGGER update_child_full_slug_trigger AFTER UPDATE ON lucid_pages
FOR EACH ROW WHEN (OLD.slug IS DISTINCT FROM NEW.slug) EXECUTE PROCEDURE update_child_full_slug();

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS lucid_categories (
  id SERIAL PRIMARY KEY,
  environment_key TEXT NOT NULL REFERENCES lucid_environments(key) ON DELETE CASCADE,
  collection_key TEXT NOT NULL,

  title TEXT NOT NULL,
  slug TEXT NOT NULL,  -- unique to collection_key and environment_key
  description TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PAGE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS lucid_page_categories (
  page_id INTEGER NOT NULL REFERENCES lucid_pages(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES lucid_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (page_id, category_id)
);

-- GROUP TABLE - collection group type, is used as a intermediary table for the collections bricks
CREATE TABLE IF NOT EXISTS lucid_groups (
  id SERIAL PRIMARY KEY,
  environment_key TEXT NOT NULL REFERENCES lucid_environments(key) ON DELETE CASCADE,
  collection_key TEXT NOT NULL, -- unique to environment_key

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by INT REFERENCES lucid_users(id) ON DELETE SET NULL
);
