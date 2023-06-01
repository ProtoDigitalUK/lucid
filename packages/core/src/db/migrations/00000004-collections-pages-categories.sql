-- COLLECTIONS TABLE
CREATE TYPE collection_type AS ENUM ('single', 'multiple');

CREATE TABLE IF NOT EXISTS lucid_collections (
  id SERIAL PRIMARY KEY,
  key: TEXT UNIQUE NOT NULL,

  title TEXT NOT NULL,
  singular TEXT NOT NULL,
  description TEXT,
  type collection_type DEFAULT 'multiple',

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PAGES TABLE - used for multiple collections
CREATE TABLE IF NOT EXISTS lucid_pages (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES lucid_pages(id) ON DELETE SET NULL,
  collection_key TEXT REFERENCES lucid_collections(key),

  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  full_slug TEXT NOT NULL, -- kept unqiue in code
  homepage BOOLEAN DEFAULT FALSE,
  excerpt TEXT,
  
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  published_by UUID REFERENCES lucid_users(id) ON DELETE SET NULL,

  created_by UUID REFERENCES lucid_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- GROUP TABLE - used for single collections to show custom settings, footer, header pages etc
CREATE TABLE IF NOT EXISTS lucid_groups (
  id SERIAL PRIMARY KEY,
  collection_key TEXT REFERENCES lucid_collections(key),

  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS lucid_categories (
  id SERIAL PRIMARY KEY,
  collection_key TEXT REFERENCES lucid_collections(key) ON DELETE CASCADE,

  title TEXT NOT NULL,
  slug TEXT NOT NULL,  -- unique per post type
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
