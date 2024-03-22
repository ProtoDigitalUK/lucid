CREATE TABLE IF NOT EXISTS headless_options (
    name TEXT UNIQUE NOT NULL PRIMARY KEY,
    value_int INTEGER,
    value_text TEXT,
    value_bool BOOLEAN
);

INSERT INTO headless_options (name, value_int) VALUES ('media_storage_used', 0);
