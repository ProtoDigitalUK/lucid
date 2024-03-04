CREATE TABLE IF NOT EXISTS headless_options (
    name TEXT UNIQUE NOT NULL PRIMARY KEY,
    value_int INTEGER,
    value_text TEXT,
    value_bool BOOLEAN
);

INSERT INTO headless_options (name, value_int) VALUES ('media_storage_used', 0);

CREATE TYPE IF NOT EXISTS headless_collection_type AS ENUM ('multiple-builder', 'single-builder');

CREATE TABLE IF NOT EXISTS headless_collections (
    key TEXT PRIMARY KEY,
    type headless_collection_type NOT NULL,

    title_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
    singular_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
    description_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
    slug_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE IF NOT EXISTS headless_collection_brick_type AS ENUM ('builder', 'fixed');
CREATE TYPE IF NOT EXISTS headless_collection_brick_position AS ENUM ('bottom', 'top', 'sidebar');

CREATE TABLE IF NOT EXISTS headless_collections_bricks (
    id SERIAL PRIMARY KEY,
    collection_key TEXT REFERENCES headless_collections(key) ON DELETE CASCADE,
    key TEXT NOT NULL,
    type headless_collection_brick_type NOT NULL,
    position headless_collection_brick_position NOT NULL
);