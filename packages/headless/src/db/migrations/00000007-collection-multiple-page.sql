CREATE TABLE IF NOT EXISTS headless_collection_multiple_page (
    id SERIAL PRIMARY KEY,
    collection_key TEXT REFERENCES headless_collections(key) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES headless_collection_multiple_page(id) ON DELETE SET NULL,
    title_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
    excerpt_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
    slug TEXT,
    full_slug TEXT, 
    homepage BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_deleted_at TIMESTAMP,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    author_id INT REFERENCES headless_users(id) ON DELETE SET NULL,
    created_by INT REFERENCES headless_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_full_slug() RETURNS trigger AS $$
DECLARE
    parent_full_slug TEXT;
BEGIN
    SELECT full_slug INTO parent_full_slug FROM headless_collection_multiple_page WHERE id = NEW.parent_id;
    
    IF parent_full_slug IS NULL THEN
        NEW.full_slug := NEW.slug;
    ELSE
        NEW.full_slug := parent_full_slug || '/' || NEW.slug;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_full_slug_trigger ON headless_collection_multiple_page;
CREATE TRIGGER update_full_slug_trigger BEFORE INSERT OR UPDATE ON headless_collection_multiple_page
FOR EACH ROW EXECUTE PROCEDURE update_full_slug();


CREATE OR REPLACE FUNCTION update_child_full_slug() RETURNS trigger AS $$
BEGIN
    IF OLD.slug != NEW.slug THEN
        UPDATE headless_collection_multiple_page SET full_slug = NEW.full_slug || substring(full_slug, length(OLD.full_slug) + 1)
        WHERE full_slug LIKE OLD.full_slug || '/%';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_child_full_slug_trigger ON headless_collection_multiple_page;
CREATE TRIGGER update_child_full_slug_trigger AFTER UPDATE ON headless_collection_multiple_page
FOR EACH ROW WHEN (OLD.slug IS DISTINCT FROM NEW.slug) EXECUTE PROCEDURE update_child_full_slug();

CREATE OR REPLACE FUNCTION on_delete_set_children_parent_to_null()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_deleted = TRUE THEN
        UPDATE headless_collection_multiple_page
        SET parent_id = NULL
        WHERE parent_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_headless_collection_multiple_page ON headless_collection_multiple_page;
CREATE TRIGGER trg_headless_collection_multiple_page AFTER UPDATE OF is_deleted ON headless_collection_multiple_page
FOR EACH ROW WHEN (OLD.is_deleted IS NOT TRUE AND NEW.is_deleted IS TRUE) EXECUTE PROCEDURE on_delete_set_children_parent_to_null();