CREATE TABLE IF NOT EXISTS headless_users (
  id SERIAL PRIMARY KEY,

  super_admin BOOLEAN DEFAULT FALSE, 
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  password TEXT NOT NULL,

  is_deletet BOOLEAN DEFAULT FALSE,
  is_deleted_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS headless_roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS headless_role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INT NOT NULL REFERENCES headless_roles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS headless_user_roles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES headless_users(id) ON DELETE CASCADE,
  role_id INT NOT NULL REFERENCES headless_roles(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS headless_user_tokens (
    id serial PRIMARY KEY,
    user_id INT NOT NULL REFERENCES headless_users(id) ON DELETE CASCADE,
    token_type varchar(255),
    token varchar(255) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT NOW(),
    expiry_date TIMESTAMP NOT NULL
);