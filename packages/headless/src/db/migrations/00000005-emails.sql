CREATE TABLE IF NOT EXISTS headless_emails (
    id SERIAL PRIMARY KEY,
    email_hash CHAR(64) NOT NULL UNIQUE,

    from_address TEXT NOT NULL,
    from_name TEXT NOT NULL,
    to_address TEXT NOT NULL,
    subject TEXT NOT NULL,
    cc TEXT,
    bcc TEXT,

    delivery_status TEXT NOT NULL, -- 'pending', 'delivered', 'failed'
    template TEXT NOT NULL,
    data JSONB,
    type TEXT NOT NULL, -- 'internal' or 'external'

    sent_count INTEGER NOT NULL DEFAULT 0,
    error_count INTEGER NOT NULL DEFAULT 0,

    last_error_message TEXT,

    last_attempt_at TIMESTAMP DEFAULT NOW(),
    last_success_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);