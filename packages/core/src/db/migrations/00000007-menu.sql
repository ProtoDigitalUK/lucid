CREATE TABLE IF NOT EXISTS headless_menus (
  id SERIAL PRIMARY KEY,
  environment_key TEXT NOT NULL REFERENCES headless_environments(key) ON DELETE CASCADE,

  key TEXT NOT NULL, -- unique in environment
  name TEXT  NOT NULL,
  description TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS headless_menu_items (
  id SERIAL PRIMARY KEY,
  menu_id INT NOT NULL REFERENCES headless_menus(id) ON DELETE CASCADE, -- changed to menu_id
  parent_id INTEGER REFERENCES headless_menu_items(id) ON DELETE CASCADE, 
  page_id INTEGER REFERENCES headless_pages(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  url TEXT,
  target TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  meta JSONB NOT NULL DEFAULT '{}'
);