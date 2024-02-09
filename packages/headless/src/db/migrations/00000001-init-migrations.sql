CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS headless_migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);