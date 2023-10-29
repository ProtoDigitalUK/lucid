-- PAGES TABLE - collection pages type
CREATE TABLE IF NOT EXISTS lucid_pages (
  id SERIAL PRIMARY KEY,
  environment_key TEXT NOT NULL REFERENCES lucid_environments(key) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES lucid_pages(id) ON DELETE SET NULL,
  collection_key TEXT NOT NULL,

  homepage BOOLEAN DEFAULT FALSE,
  
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  author_id INT REFERENCES lucid_users(id) ON DELETE SET NULL,

  created_by INT REFERENCES lucid_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_lucid_pages_collection_key ON lucid_pages(collection_key);

CREATE TABLE IF NOT EXISTS lucid_page_content (
  id SERIAL PRIMARY KEY,
  page_id INTEGER NOT NULL REFERENCES lucid_pages(id) ON DELETE CASCADE,
  language_id INTEGER NOT NULL REFERENCES lucid_languages(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  slug TEXT,
  excerpt TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE (page_id, language_id)
);

CREATE INDEX idx_lucid_page_content_page_id ON lucid_page_content(page_id);
CREATE INDEX idx_lucid_page_content_language_id ON lucid_page_content(language_id);

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

-- GROUP TABLE - collection singlepages type, is used as a intermediary table for the collections bricks
CREATE TABLE IF NOT EXISTS lucid_singlepages (
  id SERIAL PRIMARY KEY,
  environment_key TEXT NOT NULL REFERENCES lucid_environments(key) ON DELETE CASCADE,
  collection_key TEXT NOT NULL, -- unique to environment_key

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by INT REFERENCES lucid_users(id) ON DELETE SET NULL
);
