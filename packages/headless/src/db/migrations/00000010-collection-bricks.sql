CREATE TABLE IF NOT EXISTS headless_collection_bricks (
    id SERIAL PRIMARY KEY,
    brick_type TEXT NOT NULL,
    brick_key TEXT NOT NULL,

    multiple_page_id INT REFERENCES headless_collection_multiple_page(id) ON DELETE CASCADE,
    single_page_id INT REFERENCES headless_collection_single_page(id) ON DELETE CASCADE,

    brick_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS headless_groups (
    group_id SERIAL PRIMARY KEY,
    parent_group_id INT REFERENCES headless_groups(group_id) ON DELETE CASCADE,
    collection_brick_id INT REFERENCES headless_collection_bricks(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES headless_languages(id) ON DELETE CASCADE NOT NULL,
    repeater_key TEXT NOT NULL,
    group_order INT NOT NULL,
    ref TEXT NOT NULL
);
CREATE INDEX idx_headless_groups_language_id ON headless_groups(language_id);
CREATE INDEX idx_headless_groups_collection_brick_id ON headless_groups(collection_brick_id);
CREATE INDEX idx_headless_groups_parent_group_id ON headless_groups(parent_group_id);

CREATE TABLE IF NOT EXISTS headless_fields (
    fields_id SERIAL PRIMARY KEY,
    collection_brick_id INT REFERENCES headless_collection_bricks(id) ON DELETE CASCADE,
    group_id INT REFERENCES headless_groups(group_id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES headless_languages(id) ON DELETE CASCADE NOT NULL,

    key TEXT NOT NULL,
    type TEXT NOT NULL,

    text_value TEXT,
    int_value INT,
    bool_value BOOLEAN,
    json_value JSONB,
    page_link_id INT REFERENCES headless_collection_multiple_page(id) ON DELETE SET NULL,
    media_id INT REFERENCES headless_media(id) ON DELETE SET NULL
);

CREATE INDEX idx_headless_fields_language_id ON headless_fields(language_id);
CREATE INDEX idx_headless_fields_collection_brick_id ON headless_fields(collection_brick_id);
CREATE INDEX idx_headless_fields_group_id ON headless_fields(group_id);