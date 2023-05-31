-- USERS TABLE
CREATE TABLE IF NOT EXISTS lucid_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  password TEXT NOT NULL,
  account_reset BOOLEAN DEFAULT FALSE, -- if true, user will be forced to reset password and email on next login. Only used for initial account.

  delete BOOLEAN DEFAULT FALSE, -- Marked for deletion. Will be deleted on after 30 days.
  deleted_at TIMESTAMP, -- When the user was marked for deletion.

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS lucid_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES lucid_users(id) ON DELETE CASCADE,
  permissions TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
