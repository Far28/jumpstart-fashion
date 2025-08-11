-- Add reviews table for sentiment analysis
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    sentiment_score DECIMAL(3,2), -- -1 to 1 (negative to positive)
    sentiment_label VARCHAR(10) CHECK (sentiment_label IN ('positive', 'negative', 'neutral')),
    sentiment_confidence DECIMAL(3,2), -- 0 to 1
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can read all reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

-- Users can insert their own reviews
CREATE POLICY "Users can insert their own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Add some sample reviews for testing
INSERT INTO reviews (product_id, user_id, rating, review_text, sentiment_score, sentiment_label, sentiment_confidence) VALUES
-- Get a product ID first (we'll use the first women's product)
(
    (SELECT id FROM products WHERE category = 'women' LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1),
    5,
    'Absolutely love this dress! The fabric is so soft and comfortable. Perfect for both casual and formal occasions. Highly recommend!',
    0.85,
    'positive',
    0.92
),
(
    (SELECT id FROM products WHERE category = 'women' LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1),
    2,
    'The quality is disappointing. The material feels cheap and the sizing is completely off. Would not buy again.',
    -0.72,
    'negative',
    0.88
),
(
    (SELECT id FROM products WHERE category = 'women' LIMIT 1),
    (SELECT id FROM auth.users LIMIT 1),
    4,
    'Good product overall. Nice design and decent quality. Shipping was fast too.',
    0.45,
    'positive',
    0.76
);

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment_label);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
