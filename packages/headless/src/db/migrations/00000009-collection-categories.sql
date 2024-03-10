CREATE TABLE IF NOT EXISTS headless_collection_categories (
  id SERIAL PRIMARY KEY,
  collection_key TEXT NOT NULL REFERENCES headless_collections(key) ON DELETE CASCADE,

  title_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,
  description_translation_key_id INTEGER REFERENCES headless_translation_keys(id) ON DELETE SET NULL ON UPDATE CASCADE,

  slug TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  unique (collection_key, slug)
);

CREATE TABLE IF NOT EXISTS headless_collection_multiple_page_categories (
  collection_multiple_page_id INTEGER NOT NULL REFERENCES headless_collection_multiple_page(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES headless_collection_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_multiple_page_id, category_id)
);
