import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

// Local sentiment analysis function for demo mode
function analyzeLocalSentiment(text: string) {
  const positiveWords = [
    'love', 'amazing', 'excellent', 'great', 'fantastic', 'wonderful', 'perfect',
    'beautiful', 'awesome', 'incredible', 'outstanding', 'superb', 'brilliant',
    'recommend', 'comfortable', 'soft', 'good', 'nice', 'happy', 'satisfied', 
    'pleased', 'impressed', 'delighted', 'high quality', 'good quality'
  ];
  
  const negativeWords = [
    'hate', 'terrible', 'awful', 'horrible', 'bad', 'worst', 'disappointing',
    'cheap', 'poor', 'uncomfortable', 'rough', 'slow', 'delayed', 'wrong',
    'broken', 'defective', 'useless', 'waste', 'regret', 'unhappy', 'angry',
    'frustrated', 'dissatisfied', 'complaint', 'bad quality', 'poor quality', 
    'low quality', 'cheap quality'
  ];
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Check for multi-word phrases first
  negativeWords.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      negativeCount++;
    }
  });
  
  positiveWords.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      positiveCount++;
    }
  });
  
  // If no multi-word phrases found, check individual words
  if (positiveCount === 0 && negativeCount === 0) {
    const words = lowerText.split(/\s+/);
    words.forEach(word => {
      if (positiveWords.some(pw => word === pw)) positiveCount++;
      if (negativeWords.some(nw => word === nw)) negativeCount++;
    });
  }
  
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
    confidence: Math.round(confidence * 100) / 100
  };
}

interface ReviewFormProps {
  productId: string;
  productName: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, productName, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const submitReview = async () => {
    if (!user) {
      setError('Please log in to submit a review');
      return;
    }

    if (!reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if this is a sample product (starts with our UUID pattern)
      const isSampleProduct = productId.startsWith('550e8400-e29b-41d4-a716-');
      
      if (isSampleProduct) {
        // For sample products, simulate success and store locally
        console.log('Sample product detected, simulating review submission:', {
          productId,
          userId: user.id,
          rating,
          reviewText: reviewText.trim()
        });
        
        // Analyze sentiment locally for demo mode
        const sentiment = analyzeLocalSentiment(reviewText.trim());
        console.log('Local sentiment analysis result:', sentiment);
        
        // Store the review locally for sample products
        const localReview = {
          id: `local-${Date.now()}`,
          rating,
          content: reviewText.trim(),
          sentiment_score: sentiment.score,
          sentiment_label: sentiment.label,
          sentiment_confidence: sentiment.confidence,
          created_at: new Date().toISOString(),
          product_id: productId,
          user_id: user.id,
          profiles: {
            first_name: user.user_metadata?.first_name || user.email?.split('@')[0] || 'User',
            last_name: user.user_metadata?.last_name || ''
          }
        };
        
        // Get existing local reviews
        const existingReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`) || '[]');
        existingReviews.unshift(localReview); // Add to beginning
        localStorage.setItem(`reviews_${productId}`, JSON.stringify(existingReviews));
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSuccess('Review submitted successfully! (Demo mode - review saved locally)');
        setReviewText('');
        setRating(5);
        
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }

      // Try the Edge Function first for sentiment analysis
      try {
        const response = await fetch('https://pyzlsolhskzisrxzwqpp.supabase.co/functions/v1/sentiment-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            reviewText: reviewText.trim(),
            productId,
            userId: user.id,
            rating
          })
        });

        if (!response.ok) {
          throw new Error(`Edge Function error: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to submit review');
        }

        setSuccess(result.message);
        setReviewText('');
        setRating(5);
        
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }

        console.log('Review submitted with sentiment analysis:', result);

      } catch (edgeFunctionError) {
        console.warn('Edge Function failed, falling back to direct database insertion:', edgeFunctionError);
        
        // Check if this is a sample product (starts with our UUID pattern)
        const isSampleProduct = productId.startsWith('550e8400-e29b-41d4-a716-');
        
        if (isSampleProduct) {
          // For sample products, simulate success without database insertion
          console.log('Sample product detected, simulating review submission:', {
            productId,
            userId: user.id,
            rating,
            reviewText: reviewText.trim()
          });
          
          setSuccess('Review submitted successfully! (Demo mode - review saved locally)');
          setReviewText('');
          setRating(5);
          
          if (onReviewSubmitted) {
            onReviewSubmitted();
          }
          
          return;
        }
        
        // Fallback: Direct database insertion without sentiment analysis (for real products)
        const { data: review, error: dbError } = await supabase
          .from('reviews')
          .insert({
            product_id: productId,
            user_id: user.id,
            rating: rating,
            review_text: reviewText.trim()
          })
          .select()
          .single();

        if (dbError) {
          throw new Error(`Database error: ${dbError.message}`);
        }

        setSuccess('Review submitted successfully! (Note: Sentiment analysis unavailable)');
        setReviewText('');
        setRating(5);
        
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }

        console.log('Review submitted without sentiment analysis:', review);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <p className="text-center text-gray-600">Please log in to leave a review</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full transition-all duration-300 ${success ? 'ring-2 ring-green-400 shadow-lg' : ''}`}>
      <CardHeader>
        <CardTitle>✍️ Write a Review</CardTitle>
        <CardDescription>
          Share your thoughts about "{productName}" with AI sentiment analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="rating">Rating</Label>
          <div className="flex space-x-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400 transition-colors`}
              >
                ⭐
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">{rating}/5 stars</p>
        </div>

        <div>
          <Label htmlFor="review">Your Review</Label>
          <Textarea
            id="review"
            placeholder="Share your experience with this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="mt-1"
            rows={4}
          />
          <p className="text-sm text-gray-500 mt-1">
            AI will analyze the sentiment of your review automatically
          </p>
        </div>

        <Button 
          onClick={submitReview}
          disabled={loading || !reviewText.trim()}
          className="w-full"
        >
          {loading ? '🤖 Analyzing Sentiment...' : '📝 Submit Review with AI Analysis'}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg text-green-800 animate-pulse">
            <div className="flex items-center space-x-2">
              <span className="text-xl">✅</span>
              <div>
                <strong>Success!</strong> {success}
                <p className="text-sm text-green-600 mt-1">Your review will appear in the reviews section below!</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
