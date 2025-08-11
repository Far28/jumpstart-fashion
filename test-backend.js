// Backend connectivity test
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pyzlsolhskzisrxzwqpp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5emxzb2xoc2t6aXNyeHp3cXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzczOTksImV4cCI6MjA3MDE1MzM5OX0.uu7sTKpyL86VkAzE7lghQ2C0I-yLS87Cc7kK4tV3UnM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBackend() {
  console.log('🔍 Testing Supabase Backend Connection...\n');
  
  try {
    // Test 1: Database connectivity
    console.log('1. Testing database connectivity...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .limit(3);
    
    if (productsError) {
      console.log('❌ Products table error:', productsError.message);
    } else {
      console.log('✅ Products table accessible:', products?.length || 0, 'products found');
    }

    // Test 2: Reviews table
    console.log('\n2. Testing reviews table...');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, content, rating')
      .limit(3);
    
    if (reviewsError) {
      console.log('❌ Reviews table error:', reviewsError.message);
    } else {
      console.log('✅ Reviews table accessible:', reviews?.length || 0, 'reviews found');
    }

    // Test 3: Auth status
    console.log('\n3. Testing authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('ℹ️ No authenticated user (expected for test)');
    } else {
      console.log('✅ Auth system working, user:', user ? 'logged in' : 'not logged in');
    }

    console.log('\n🎉 Backend connectivity test completed!');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
  }
}

testBackend();
