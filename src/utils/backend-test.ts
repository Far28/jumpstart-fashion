import { supabase } from '@/integrations/supabase/client';

// Test database connectivity and data
export async function testBackendHealth() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test 1: Basic connectivity
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Test 2: Check products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Products table error:', productsError);
    } else {
      console.log(`✅ Products table accessible. Found ${products?.length || 0} products`);
      if (products && products.length > 0) {
        console.log('Sample product:', products[0]);
      }
    }
    
    // Test 3: Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔐 Authentication status:', session ? 'Logged in' : 'Not logged in');
    
    return true;
  } catch (error) {
    console.error('💥 Backend health check failed:', error);
    return false;
  }
}

// Call this function in your app to test backend
testBackendHealth();
