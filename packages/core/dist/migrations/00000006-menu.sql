CREATE TABLE IF NOT EXISTS lucid_menus (
  id SERIAL PRIMARY KEY,
  environment_key TEXT NOT NULL REFERENCES lucid_environments(key) ON DELETE CASCADE,

  key TEXT NOT NULL, -- unique in environment
  name TEXT  NOT NULL,
  description TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lucid_menu_items (
  id SERIAL PRIMARY KEY,
  menu_id INT NOT NULL REFERENCES lucid_menus(id) ON DELETE CASCADE, -- changed to menu_id
  parent_id INTEGER REFERENCES lucid_menu_items(id) ON DELETE CASCADE, 
  page_id INTEGER REFERENCES lucid_pages(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  url TEXT,
  target TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  meta JSONB NOT NULL DEFAULT '{}'
);