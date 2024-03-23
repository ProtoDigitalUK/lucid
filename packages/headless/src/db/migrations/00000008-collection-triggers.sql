CREATE OR REPLACE FUNCTION update_full_slug() RETURNS trigger AS $$
DECLARE
    parent_full_slug TEXT;
BEGIN
    SELECT full_slug INTO parent_full_slug FROM headless_collection_document WHERE id = NEW.parent_id;
    
    IF parent_full_slug IS NULL THEN
        NEW.full_slug := NEW.slug;
    ELSE
        NEW.full_slug := parent_full_slug || '/' || NEW.slug;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_full_slug_trigger ON headless_collection_document;
CREATE TRIGGER update_full_slug_trigger BEFORE INSERT OR UPDATE ON headless_collection_document
FOR EACH ROW EXECUTE PROCEDURE update_full_slug();


CREATE OR REPLACE FUNCTION update_child_full_slug() RETURNS trigger AS $$
BEGIN
    IF OLD.slug != NEW.slug THEN
        UPDATE headless_collection_document SET full_slug = NEW.full_slug || substring(full_slug, length(OLD.full_slug) + 1)
        WHERE full_slug LIKE OLD.full_slug || '/%';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_child_full_slug_trigger ON headless_collection_document;
CREATE TRIGGER update_child_full_slug_trigger AFTER UPDATE ON headless_collection_document
FOR EACH ROW WHEN (OLD.slug IS DISTINCT FROM NEW.slug) EXECUTE PROCEDURE update_child_full_slug();

CREATE OR REPLACE FUNCTION on_delete_set_children_parent_to_null()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_deleted = TRUE THEN
        UPDATE headless_collection_document
        SET parent_id = NULL
        WHERE parent_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_headless_collection_multiple_builder ON headless_collection_document;
CREATE TRIGGER trg_headless_collection_multiple_builder AFTER UPDATE OF is_deleted ON headless_collection_document
FOR EACH ROW WHEN (OLD.is_deleted IS NOT TRUE AND NEW.is_deleted IS TRUE) EXECUTE PROCEDURE on_delete_set_children_parent_to_null();