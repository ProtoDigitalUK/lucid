-- POST TYPES TABLE
CREATE TABLE IF NOT EXISTS lucid_post_types (
  id SERIAL PRIMARY KEY,

  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  singular_name TEXT NOT NULL
);

INSERT INTO lucid_post_types (key, name, singular_name) VALUES ('page', 'Pages', 'Page');

-- PAGES TABLE
CREATE TABLE IF NOT EXISTS lucid_pages (
  id SERIAL PRIMARY KEY,
  post_type_id INTEGER NOT NULL REFERENCES lucid_post_types(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES lucid_pages(id) ON DELETE SET NULL,

  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  published_by UUID REFERENCES lucid_users(id) ON DELETE SET NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS lucid_categories (
  id SERIAL PRIMARY KEY,
  post_type_id INTEGER NOT NULL REFERENCES lucid_post_types(id) ON DELETE CASCADE,

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

