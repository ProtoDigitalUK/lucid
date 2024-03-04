CREATE TABLE IF NOT EXISTS headless_collection_multiple_builder (
    id SERIAL PRIMARY KEY,
    collection_key TEXT REFERENCES headless_collections(key) ON DELETE CASCADE,

    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    author_id INT REFERENCES headless_users(id) ON DELETE SET NULL,

    created_by INT REFERENCES headless_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS headless_collection_multiple_builder_content (
    id SERIAL PRIMARY KEY,
    collection_multiple_builder_id INTEGER NOT NULL REFERENCES headless_collection_multiple_builder(id) ON DELETE CASCADE,
    language_id INTEGER NOT NULL REFERENCES headless_languages(id) ON DELETE CASCADE,
    collection_key TEXT REFERENCES headless_collections(key) ON DELETE CASCADE,

    title TEXT,
    slug TEXT,
    excerpt TEXT,

    UNIQUE (page_id, language_id)
);

CREATE INDEX idx_headless_collection_multiple_builder_content_collection_multiple_builder_id ON headless_collection_multiple_builder_content(collection_multiple_builder_id);
CREATE INDEX idx_headless_collection_multiple_builder_content_language_id ON headless_collection_multiple_builder_content(language_id);
CREATE INDEX idx_headless_collection_multiple_builder_content_slug ON headless_collection_multiple_builder_content(slug);