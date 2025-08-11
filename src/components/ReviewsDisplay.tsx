import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  rating: number;
  content: string; // This matches your actual database column
  review_text?: string; // Keep this for backward compatibility
  sentiment_score?: number; // Make optional since it might not exist yet
  sentiment_label?: string; // Make optional since it might not exist yet
  sentiment_confidence?: number; // Make optional since it might not exist yet
  created_at: string;
  title?: string; // Add this since it exists in your database
  product_id: string;
  user_id: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
  };
}

interface ReviewsDisplayProps {
  productId: string;
  refreshTrigger?: number;
}

const ReviewsDisplay: React.FC<ReviewsDisplayProps> = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentimentStats, setSentimentStats] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
    averageScore: 0
  });

  const loadReviews = async () => {
    try {
      // Check if this is a sample product (starts with our UUID pattern)
      const isSampleProduct = productId.startsWith('550e8400-e29b-41d4-a716-');
      
      if (isSampleProduct) {
        // For sample products, show some demo reviews + any locally stored reviews
        const demoReviews: Review[] = [
          {
            id: 'demo-1',
            rating: 5,
            content: 'Amazing quality! The material feels luxurious and the fit is perfect. Highly recommend!',
            sentiment_score: 0.85,
            sentiment_label: 'positive',
            sentiment_confidence: 0.95,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            product_id: productId,
            user_id: 'demo-user-1',
            profiles: {
              first_name: 'Sarah',
              last_name: 'M.'
            }
          },
          {
            id: 'demo-2',
            rating: 4,
            content: 'Good product overall. The style is exactly what I was looking for, though shipping took a bit longer than expected.',
            sentiment_score: 0.3,
            sentiment_label: 'positive',
            sentiment_confidence: 0.8,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            product_id: productId,
            user_id: 'demo-user-2',
            profiles: {
              first_name: 'Jennifer',
              last_name: 'K.'
            }
          },
          {
            id: 'demo-3',
            rating: 5,
            content: 'Absolutely love this! The colors are vibrant and it looks exactly like the photos. Will definitely shop here again.',
            sentiment_score: 0.92,
            sentiment_label: 'positive',
            sentiment_confidence: 0.98,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            product_id: productId,
            user_id: 'demo-user-3',
            profiles: {
              first_name: 'Emma',
              last_name: 'D.'
            }
          }
        ];
        
        // Get locally stored reviews for this product
        const localReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`) || '[]');
        
        // Merge local reviews with demo reviews, with local reviews first
        const allReviews = [...localReviews, ...demoReviews];
        
        setReviews(allReviews);
        
        // Calculate demo sentiment statistics
        const stats = allReviews.reduce((acc, review) => {
          const sentimentLabel = review.sentiment_label || 'neutral';
          const sentimentScore = review.sentiment_score || 0;
          
          if (sentimentLabel in acc) {
            acc[sentimentLabel as keyof typeof acc]++;
          }
          acc.averageScore += sentimentScore;
          return acc;
        }, { positive: 0, negative: 0, neutral: 0, averageScore: 0 });

        stats.averageScore = allReviews.length ? stats.averageScore / allReviews.length : 0;
        setSentimentStats(stats);
        
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading reviews:', error);
        return;
      }

      // Cast to our Review interface since the database might not have all sentiment columns yet
      const reviewsData = (data || []) as Review[];
      setReviews(reviewsData);

      // Calculate sentiment statistics
      const stats = reviewsData.reduce((acc, review) => {
        const sentimentLabel = review.sentiment_label || 'neutral';
        const sentimentScore = review.sentiment_score || 0;
        
        if (sentimentLabel in acc) {
          acc[sentimentLabel as keyof typeof acc]++;
        }
        acc.averageScore += sentimentScore;
        return acc;
      }, { positive: 0, negative: 0, neutral: 0, averageScore: 0 });

      stats.averageScore = reviewsData.length ? stats.averageScore / reviewsData.length : 0;
      setSentimentStats(stats);

    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId, refreshTrigger]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <p className="text-center">Loading reviews...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sentiment Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>📊 AI Sentiment Analysis Dashboard</CardTitle>
          <CardDescription>
            Real-time sentiment analysis of customer reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sentimentStats.positive}</div>
              <div className="text-sm text-gray-600">😊 Positive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{sentimentStats.negative}</div>
              <div className="text-sm text-gray-600">😞 Negative</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{sentimentStats.neutral}</div>
              <div className="text-sm text-gray-600">😐 Neutral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {sentimentStats.averageScore.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>💬 Customer Reviews ({reviews.length})</CardTitle>
          <CardDescription>
            Reviews with AI-powered sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-600">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        by {review.profiles?.first_name || 'Anonymous'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSentimentColor(review.sentiment_label || 'neutral')}>
                        {getSentimentIcon(review.sentiment_label || 'neutral')} {(review.sentiment_label || 'NEUTRAL').toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {Math.round((review.sentiment_confidence || 0.5) * 100)}% confident
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-800 mb-2">{review.review_text || review.content}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      Sentiment Score: {(review.sentiment_score || 0) > 0 ? '+' : ''}{review.sentiment_score || 0}
                    </span>
                    <span>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsDisplay;
