CREATE TABLE IF NOT EXISTS lucid_page_bricks (
  id SERIAL PRIMARY KEY,
  brick_key TEXT NOT NULL,
  page_id INT REFERENCES lucid_pages(id) ON DELETE CASCADE,
  group_id INT REFERENCES lucid_groups(id) ON DELETE CASCADE,
  
  brick_order INT NOT NULL
);

CREATE TABLE IF NOT EXISTS lucid_fields (
    id SERIAL PRIMARY KEY,
    page_brick_id INT REFERENCES lucid_page_bricks(id) ON DELETE CASCADE,
    parent_repeater INT REFERENCES lucid_fields(id) ON DELETE CASCADE,

    key TEXT NOT NULL,
    type TEXT NOT NULL,
    group_position INT,

    text_value TEXT,
    int_value INT,
    bool_value BOOLEAN,
    datetime_value TIMESTAMP,
    json_value JSONB,
    image_value TEXT, -- this will be a reference to the image in the file system at some point
    file_value TEXT -- this will be a reference to the file in the file system at some point
);
