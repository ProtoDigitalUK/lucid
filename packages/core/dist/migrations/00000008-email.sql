CREATE TABLE IF NOT EXISTS lucid_emails (
  id SERIAL PRIMARY KEY,
  email_hash CHAR(64) NOT NULL UNIQUE,

  from_address TEXT,
  from_name TEXT,
  to_address TEXT,
  subject TEXT,
  cc TEXT,
  bcc TEXT,

  delivery_status TEXT NOT NULL,
  template TEXT NOT NULL,
  data JSONB,
  type TEXT NOT NULL,
  sent_count INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);