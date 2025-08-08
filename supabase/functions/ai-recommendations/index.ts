import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, preferences, category, limit = 5 } = await req.json();

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's purchase history and profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Get all products for analysis
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(100);

    if (productsError) {
      throw new Error(`Error fetching products: ${productsError.message}`);
    }

    // Create AI prompt for recommendations
    const prompt = `
    You are a fashion AI assistant for JumpStart, a premium fashion retailer. 
    
    User Profile:
    - Name: ${profile?.first_name} ${profile?.last_name}
    - Preferences: ${preferences || 'No specific preferences provided'}
    - Category Interest: ${category || 'All categories'}
    
    Available Products:
    ${products?.map(p => `
    - ID: ${p.id}
    - Name: ${p.name}
    - Category: ${p.category}
    - Subcategory: ${p.subcategory}
    - Price: $${p.price}
    - Sale Price: ${p.sale_price ? `$${p.sale_price}` : 'None'}
    - Rating: ${p.rating}/5
    - Description: ${p.description}
    - Brand: ${p.brand}
    - Tags: ${p.tags?.join(', ') || 'None'}
    `).join('\n')}
    
    Based on the user profile and preferences, recommend ${limit} products that would be perfect for this user.
    Consider style preferences, category interests, price points, ratings, and current trends.
    
    Respond with ONLY a JSON array of product IDs in order of recommendation strength (best first).
    Format: ["product-id-1", "product-id-2", "product-id-3"]
    
    No additional text or explanation - just the JSON array.
    `;

    // Get AI recommendations
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a fashion AI that returns product recommendations as JSON arrays of product IDs only.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const recommendedIds = JSON.parse(aiResponse.choices[0].message.content.trim());

    // Fetch recommended products
    const { data: recommendedProducts, error: recommendError } = await supabase
      .from('products')
      .select('*')
      .in('id', recommendedIds);

    if (recommendError) {
      throw new Error(`Error fetching recommended products: ${recommendError.message}`);
    }

    // Sort products by recommendation order
    const sortedProducts = recommendedIds
      .map((id: string) => recommendedProducts?.find(p => p.id === id))
      .filter(Boolean);

    console.log(`Generated ${sortedProducts.length} recommendations for user ${userId}`);

    return new Response(
      JSON.stringify({ 
        recommendations: sortedProducts,
        total: sortedProducts.length,
        preferences_used: preferences,
        category_filter: category
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-recommendations function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        recommendations: [],
        total: 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});