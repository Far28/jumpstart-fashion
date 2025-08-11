import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple sentiment analysis using keyword-based approach
// In production, you'd use TextBlob, VADER, or OpenAI for better accuracy
function analyzeSentiment(text: string) {
  const positiveWords = [
    'love', 'amazing', 'excellent', 'great', 'fantastic', 'wonderful', 'perfect',
    'beautiful', 'awesome', 'incredible', 'outstanding', 'superb', 'brilliant',
    'recommend', 'comfortable', 'soft', 'quality', 'fast', 'good', 'nice',
    'happy', 'satisfied', 'pleased', 'impressed', 'delighted'
  ];
  
  const negativeWords = [
    'hate', 'terrible', 'awful', 'horrible', 'bad', 'worst', 'disappointing',
    'cheap', 'poor', 'uncomfortable', 'rough', 'slow', 'delayed', 'wrong',
    'broken', 'defective', 'useless', 'waste', 'regret', 'unhappy', 'angry',
    'frustrated', 'dissatisfied', 'complaint'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });
  
  const totalSentimentWords = positiveCount + negativeCount;
  const sentimentScore = totalSentimentWords === 0 
    ? 0 
    : (positiveCount - negativeCount) / Math.max(totalSentimentWords, 1);
  
  let label = 'neutral';
  let confidence = 0.5;
  
  if (sentimentScore > 0.2) {
    label = 'positive';
    confidence = Math.min(0.9, 0.6 + Math.abs(sentimentScore));
  } else if (sentimentScore < -0.2) {
    label = 'negative';
    confidence = Math.min(0.9, 0.6 + Math.abs(sentimentScore));
  }
  
  return {
    score: Math.round(sentimentScore * 100) / 100,
    label,
    confidence: Math.round(confidence * 100) / 100,
    details: {
      positiveWords: positiveCount,
      negativeWords: negativeCount,
      totalWords: words.length
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reviewText, productId, userId, rating } = await req.json();

    if (!reviewText || !productId || !userId || !rating) {
      throw new Error('Missing required fields: reviewText, productId, userId, rating');
    }

    // Analyze sentiment
    const sentiment = analyzeSentiment(reviewText);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Save review with sentiment analysis
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: userId,
        rating: rating,
        review_text: reviewText, // Use 'review_text' to match the database schema
        sentiment_score: sentiment.score,
        sentiment_label: sentiment.label,
        sentiment_confidence: sentiment.confidence
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`Sentiment analysis completed for review ${review.id}: ${sentiment.label} (${sentiment.score})`);

    return new Response(JSON.stringify({
      success: true,
      review: review,
      sentiment: sentiment,
      message: `Review submitted successfully! Sentiment: ${sentiment.label.toUpperCase()} (confidence: ${Math.round(sentiment.confidence * 100)}%)`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in sentiment-analysis function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'An unexpected error occurred',
      sentiment: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
