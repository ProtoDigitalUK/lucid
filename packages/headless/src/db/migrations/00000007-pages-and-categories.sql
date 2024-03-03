-- PAGES TABLE - collection pages type
CREATE TABLE IF NOT EXISTS headless_pages (
    id SERIAL PRIMARY KEY,
    environment_key TEXT NOT NULL REFERENCES headless_environments(key) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES headless_pages(id) ON DELETE SET NULL,
    collection_key TEXT NOT NULL,

    homepage BOOLEAN DEFAULT FALSE,

    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    author_id INT REFERENCES headless_users(id) ON DELETE SET NULL,

    created_by INT REFERENCES headless_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_headless_pages_collection_key ON headless_pages(collection_key);

CREATE TABLE IF NOT EXISTS headless_page_content (
    id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES headless_pages(id) ON DELETE CASCADE,
    language_id INTEGER NOT NULL REFERENCES headless_languages(id) ON DELETE CASCADE,

    title TEXT,
    slug TEXT,
    full_slug TEXT,
    excerpt TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (page_id, language_id)
);

CREATE INDEX idx_headless_page_content_page_id ON headless_page_content(page_id);
CREATE INDEX idx_headless_page_content_language_id ON headless_page_content(language_id);
CREATE INDEX idx_headless_page_content_full_slug ON headless_page_content(full_slug);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS headless_categories (
    id SERIAL PRIMARY KEY,
    environment_key TEXT NOT NULL REFERENCES headless_environments(key) ON DELETE CASCADE,
    collection_key TEXT NOT NULL,

    title_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
    slug_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
    description_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PAGE CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS headless_page_categories (
    page_id INTEGER NOT NULL REFERENCES headless_pages(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES headless_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (page_id, category_id)
);

-- GROUP TABLE - collection singlepages type, is used as a intermediary table for the collections bricks
CREATE TABLE IF NOT EXISTS headless_singlepages (
    id SERIAL PRIMARY KEY,
    environment_key TEXT NOT NULL REFERENCES headless_environments(key) ON DELETE CASCADE,
    collection_key TEXT NOT NULL, -- unique to environment_key

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INT REFERENCES headless_users(id) ON DELETE SET NULL
);
