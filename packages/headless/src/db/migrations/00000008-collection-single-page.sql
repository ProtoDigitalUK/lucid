CREATE TABLE IF NOT EXISTS headless_collection_single_page (
    id SERIAL PRIMARY KEY,
    collection_key TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INT REFERENCES headless_users(id) ON DELETE SET NULL
);