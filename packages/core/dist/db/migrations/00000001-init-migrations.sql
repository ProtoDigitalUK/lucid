CREATE TABLE IF NOT EXISTS lucid_migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);