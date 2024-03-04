CREATE TABLE IF NOT EXISTS headless_options (
    name TEXT UNIQUE NOT NULL PRIMARY KEY,
    value_int INTEGER,
    value_text TEXT,
    value_bool BOOLEAN
);

INSERT INTO headless_options (name, value_int) VALUES ('media_storage_used', 0);

CREATE TYPE headless_collection_type AS ENUM ('multiple-builder', 'single-builder');

CREATE TABLE IF NOT EXISTS headless_collections (
    key TEXT PRIMARY KEY,
    type headless_collection_type NOT NULL,
    title TEXT NOT NULL,
    singular TEXT NOT NULL,
    description TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS headless_collection_slugs (
    id SERIAL PRIMARY KEY,
    collection_key TEXT REFERENCES headless_collections(key) ON DELETE CASCADE,
    language_id INTEGER REFERENCES headless_languages(id) ON DELETE CASCADE,
    slug TEXT,
    UNIQUE (collection_key, language_id)
);

CREATE TYPE headless_collection_brick_type AS ENUM ('builder', 'fixed');
CREATE TYPE headless_collection_brick_position AS ENUM ('bottom', 'top', 'sidebar');

CREATE TABLE IF NOT EXISTS headless_collections_bricks (
    id SERIAL PRIMARY KEY,
    collection_key TEXT REFERENCES headless_collections(key) ON DELETE CASCADE,
    key TEXT NOT NULL,
    type headless_collection_brick_type NOT NULL,
    position headless_collection_brick_position NOT NULL
);