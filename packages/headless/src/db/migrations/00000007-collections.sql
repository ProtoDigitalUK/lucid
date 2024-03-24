-- Collection Documents
CREATE TABLE IF NOT EXISTS headless_collection_documents (
    id SERIAL PRIMARY KEY,
    collection_key TEXT NOT NULL,

    parent_id INTEGER REFERENCES headless_collection_documents(id) ON DELETE SET NULL,
    slug TEXT,
    full_slug TEXT, 
    homepage BOOLEAN DEFAULT FALSE,
    
    is_deleted BOOLEAN DEFAULT FALSE,
    is_deleted_at TIMESTAMP,
    author_id INT REFERENCES headless_users(id) ON DELETE SET NULL,
    deleted_by INT REFERENCES headless_users(id) ON DELETE SET NULL,
    created_by INT REFERENCES headless_users(id) ON DELETE SET NULL,
    updated_by INT REFERENCES headless_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bricks 
CREATE TABLE IF NOT EXISTS headless_collection_document_bricks (
    id SERIAL PRIMARY KEY,
    collection_document_id INT REFERENCES headless_collection_documents(id) ON DELETE CASCADE NOT NULL,

    is_content_type BOOLEAN DEFAULT FALSE,
    brick_type TEXT NOT NULL, -- builder, fixed, content
    brick_key TEXT,
    brick_order INT,

    unique (collection_document_id, is_content_type)
);

-- GROUPS
CREATE TABLE IF NOT EXISTS headless_collection_document_groups (
    group_id SERIAL PRIMARY KEY,
    collection_document_id INT REFERENCES headless_collection_documents(id) ON DELETE CASCADE NOT NULL,
    collection_brick_id INT REFERENCES headless_collection_document_bricks(id) ON DELETE CASCADE NOT NULL,
    parent_group_id INT REFERENCES headless_collection_document_groups(group_id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES headless_languages(id) ON DELETE CASCADE NOT NULL,
    repeater_key TEXT NOT NULL,
    group_order INT NOT NULL,
    ref TEXT
);
CREATE INDEX idx_headless_groups_language_id ON headless_collection_document_groups(language_id);
CREATE INDEX idx_headless_groups_collection_brick_id ON headless_collection_document_groups(collection_brick_id);
CREATE INDEX idx_headless_groups_parent_group_id ON headless_collection_document_groups(parent_group_id);

-- FIELDS
CREATE TABLE IF NOT EXISTS headless_collection_document_fields (
    fields_id SERIAL PRIMARY KEY,
    collection_document_id INT REFERENCES headless_collection_documents(id) ON DELETE CASCADE NOT NULL,
    collection_brick_id INT REFERENCES headless_collection_document_bricks(id) ON DELETE CASCADE NOT NULL,
    group_id INT REFERENCES headless_collection_document_groups(group_id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES headless_languages(id) ON DELETE CASCADE NOT NULL,

    key TEXT NOT NULL,
    type TEXT NOT NULL,

    text_value TEXT,
    int_value INT,
    bool_value BOOLEAN,
    json_value JSONB,
    page_link_id INT REFERENCES headless_collection_documents(id) ON DELETE SET NULL,
    media_id INT REFERENCES headless_media(id) ON DELETE SET NULL
);

CREATE INDEX idx_headless_fields_language_id ON headless_collection_document_fields(language_id);
CREATE INDEX idx_headless_fields_collection_brick_id ON headless_collection_document_fields(collection_brick_id);
CREATE INDEX idx_headless_fields_group_id ON headless_collection_document_fields(group_id);

-- Categories
CREATE TABLE IF NOT EXISTS headless_collection_categories (
  id SERIAL PRIMARY KEY,
  collection_key TEXT NOT NULL,

  title_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
  description_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,

  slug TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  unique (collection_key, slug)
);

CREATE TABLE IF NOT EXISTS headless_collection_document_categories (
  collection_document_id INT REFERENCES headless_collection_documents(id) ON DELETE CASCADE NOT NULL,
  category_id INTEGER NOT NULL REFERENCES headless_collection_categories(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (collection_document_id, category_id),

  unique (collection_document_id, category_id)
);
