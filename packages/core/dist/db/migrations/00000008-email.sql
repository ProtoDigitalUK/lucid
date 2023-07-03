CREATE TABLE IF NOT EXISTS lucid_emails (
  id SERIAL PRIMARY KEY,

  from_address TEXT,
  to_address TEXT,
  subject TEXT,
  cc TEXT,
  bcc TEXT,

  delivery_status TEXT NOT NULL,
  template TEXT NOT NULL,
  data JSONB,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);