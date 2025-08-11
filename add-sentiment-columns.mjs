// Script to add sentiment analysis columns to the database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyzlsolhskzisrxzwqpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5emxzb2xoc2t6aXNyeHp3cXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzczOTksImV4cCI6MjA3MDE1MzM5OX0.uu7sTKpyL86VkAzE7lghQ2C0I-yLS87Cc7kK4tV3UnM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSentimentColumns() {
  console.log('🔄 Adding sentiment analysis columns to reviews table...\n');
  
  try {
    // First, let's check the current structure of the reviews table
    console.log('1. Checking current reviews table structure...');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
    
    if (reviewsError) {
      console.log('❌ Error accessing reviews table:', reviewsError.message);
      return;
    }
    
    console.log('✅ Reviews table accessible');
    if (reviews && reviews.length > 0) {
      console.log('📋 Current columns:', Object.keys(reviews[0]));
      
      // Check if sentiment columns already exist
      const hasSenitmentColumns = 'sentiment_score' in reviews[0];
      if (hasSenitmentColumns) {
        console.log('✅ Sentiment analysis columns already exist!');
        return;
      }
    }
    
    console.log('\n2. Manual migration needed...');
    console.log('🔗 Please run this SQL in your Supabase SQL Editor:');
    console.log('\n--- Copy and paste this SQL into Supabase Dashboard → SQL Editor ---');
    console.log(`
-- Add sentiment analysis columns to reviews table
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS sentiment_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS sentiment_label TEXT CHECK (sentiment_label IN ('positive', 'negative', 'neutral')),
ADD COLUMN IF NOT EXISTS sentiment_confidence DECIMAL(3,2);

-- Add indexes for sentiment analysis
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment_label ON public.reviews(sentiment_label);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment_score ON public.reviews(sentiment_score);

-- Add comments for documentation
COMMENT ON COLUMN public.reviews.sentiment_score IS 'AI sentiment analysis score from -1.00 (very negative) to 1.00 (very positive)';
COMMENT ON COLUMN public.reviews.sentiment_label IS 'AI sentiment classification: positive, negative, or neutral';
COMMENT ON COLUMN public.reviews.sentiment_confidence IS 'AI confidence level from 0.00 to 1.00';
`);
    console.log('--- End of SQL ---\n');
    
    console.log('📍 Steps to apply:');
    console.log('1. Go to https://supabase.com/dashboard/project/pyzlsolhskzisrxzwqpp');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL above');
    console.log('4. Click "Run" to execute');
    console.log('\n✨ After running the SQL, your sentiment analysis will be fully functional!');
    
  } catch (error) {
    console.error('❌ Script error:', error.message);
  }
}

addSentimentColumns();
