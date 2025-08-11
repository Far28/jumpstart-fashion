-- Fix reviews table column mismatch
-- The application expects 'content' column but database has 'review_text'

-- Option 1: Add content column and copy data from review_text
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS content TEXT;
UPDATE reviews SET content = review_text WHERE content IS NULL;

-- Option 2: Drop review_text column if you want to fully migrate to content
-- ALTER TABLE reviews DROP COLUMN IF EXISTS review_text;

-- Ensure we have all required columns for the application
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS title TEXT;

-- Update the schema to match what the application expects
-- The application interface expects these fields:
-- - id (UUID)
-- - user_id (UUID)  
-- - product_id (UUID)
-- - rating (INTEGER 1-5)
-- - title (TEXT, optional)
-- - content (TEXT) -- This was missing!
-- - created_at (TIMESTAMP)
-- - updated_at (TIMESTAMP)
