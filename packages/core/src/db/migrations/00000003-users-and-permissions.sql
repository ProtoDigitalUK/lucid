-- USERS TABLE
CREATE TABLE IF NOT EXISTS lucid_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS lucid_permissions (
  user_id UUID REFERENCES lucid_users(id) ON DELETE CASCADE,
 
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
