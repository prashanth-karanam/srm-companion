-- Run this in Supabase SQL editor to create the users table
CREATE TABLE IF NOT EXISTS users (
    srm_id       TEXT PRIMARY KEY,
    srm_cookies  TEXT,                        -- Fernet-encrypted JSON string
    scraped_data JSONB DEFAULT '{}'::jsonb,   -- Latest portal data
    last_login   TIMESTAMPTZ,
    last_scraped TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index on last_scraped so mass-refresh queries are fast
CREATE INDEX IF NOT EXISTS idx_users_last_scraped ON users (last_scraped);
