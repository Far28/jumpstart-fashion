-- Add sentiment analysis columns to reviews table
ALTER TABLE public.reviews 
ADD COLUMN sentiment_score DECIMAL(3,2), -- Score between -1.00 and 1.00
ADD COLUMN sentiment_label TEXT CHECK (sentiment_label IN ('positive', 'negative', 'neutral')),
ADD COLUMN sentiment_confidence DECIMAL(3,2); -- Confidence between 0.00 and 1.00

-- Add indexes for sentiment analysis
CREATE INDEX idx_reviews_sentiment_label ON public.reviews(sentiment_label);
CREATE INDEX idx_reviews_sentiment_score ON public.reviews(sentiment_score);

-- Add comment for documentation
COMMENT ON COLUMN public.reviews.sentiment_score IS 'AI sentiment analysis score from -1.00 (very negative) to 1.00 (very positive)';
COMMENT ON COLUMN public.reviews.sentiment_label IS 'AI sentiment classification: positive, negative, or neutral';
COMMENT ON COLUMN public.reviews.sentiment_confidence IS 'AI confidence level from 0.00 to 1.00';
