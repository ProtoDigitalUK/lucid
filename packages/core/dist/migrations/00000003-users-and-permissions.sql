-- USERS TABLE
CREATE TABLE IF NOT EXISTS lucid_users (
  id SERIAL PRIMARY KEY,

  super_admin BOOLEAN DEFAULT FALSE, 
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  password TEXT NOT NULL,

  delete BOOLEAN DEFAULT FALSE, -- Marked for deletion. Will be deleted on after 30 days.
  deleted_at TIMESTAMP, -- When the user was marked for deletion.

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ROLES TABLE
CREATE TABLE IF NOT EXISTS lucid_roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ROLE PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS lucid_role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INT NOT NULL REFERENCES lucid_roles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  environment_key TEXT REFERENCES lucid_environments(key) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- USER ROLES TABLE
CREATE TABLE IF NOT EXISTS lucid_user_roles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES lucid_users(id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES lucid_roles(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- USER TOKENS TABLE
CREATE TABLE IF NOT EXISTS lucid_user_tokens (
    id serial PRIMARY KEY,
    user_id INT NOT NULL REFERENCES lucid_users(id) ON DELETE CASCADE,
    token_type varchar(255),
    token varchar(255) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT NOW(),
    expiry_date TIMESTAMP NOT NULL
);