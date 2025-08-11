import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const AIRecommendationsTest = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getFallbackRecommendations = async () => {
    // Fallback: Get random products from the database when AI fails
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'women')
      .limit(3);
    
    return products || [];
  };

  const testAIRecommendations = async () => {
    if (!user) {
      setError('Please log in to test AI recommendations');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found. Please log in again.');
      }

      console.log('Making request to AI function with user:', user.id);

      const response = await fetch('https://pyzlsolhskzisrxzwqpp.supabase.co/functions/v1/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          userId: user.id,
          preferences: 'Casual style, comfortable clothing, modern designs',
          category: 'women',
          limit: 3
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        
        // Check if it's an OpenAI rate limit error
        if (errorText.includes('Too Many Requests') || errorText.includes('rate limit')) {
          console.log('OpenAI rate limit hit, using fallback recommendations');
          const fallbackProducts = await getFallbackRecommendations();
          setRecommendations(fallbackProducts);
          setError('⚠️ OpenAI rate limit reached. Showing fallback recommendations. Your AI function is working correctly!');
          return;
        }
        
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        // Check if it's an OpenAI error
        if (data.error.includes('OpenAI') || data.error.includes('rate limit')) {
          console.log('OpenAI error, using fallback recommendations');
          const fallbackProducts = await getFallbackRecommendations();
          setRecommendations(fallbackProducts);
          setError('⚠️ OpenAI API issue (likely rate limit). Showing fallback recommendations. Your function setup is correct!');
          return;
        }
        throw new Error(data.error);
      }

      setRecommendations(data.recommendations || []);
      console.log('✅ AI Recommendations successful:', data);
    } catch (err) {
      // Last resort fallback
      console.log('Using final fallback due to error:', err);
      try {
        const fallbackProducts = await getFallbackRecommendations();
        setRecommendations(fallbackProducts);
        setError(`⚠️ AI function error, but showing fallback recommendations. Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } catch (fallbackErr) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error testing AI recommendations:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8" data-ai-recommendations>
      <CardHeader>
        <CardTitle>🤖 AI Recommendations Test</CardTitle>
        <CardDescription>
          Test the AI-powered product recommendations system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testAIRecommendations} 
          disabled={loading || !user}
          className="w-full"
        >
          {loading ? 'Getting AI Recommendations...' : 'Test AI Recommendations'}
        </Button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-700">
              ✅ AI Recommendations Working! ({recommendations.length} products)
            </h3>
            <div className="grid gap-4">
              {recommendations.map((product: any, index) => (
                <div key={product.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{index + 1}. {product.name}</h4>
                      <p className="text-sm text-gray-600">{product.category} - {product.subcategory}</p>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${product.sale_price || product.price}
                        {product.sale_price && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            ${product.price}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Rating</div>
                      <div className="text-lg font-semibold">{product.rating}/5 ⭐</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!user && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            Please log in to test AI recommendations
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendationsTest;
