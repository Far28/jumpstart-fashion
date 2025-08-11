import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://pyzlsolhskzisrxzwqpp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5emxzb2xoc2t6aXNyeHp3cXBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzczOTksImV4cCI6MjA3MDE1MzM5OX0.uu7sTKpyL86VkAzE7lghQ2C0I-yLS87Cc7kK4tV3UnM";

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sample products data
const sampleProducts = [
  {
    name: 'Elegant Evening Dress',
    description: 'A stunning black evening dress perfect for special occasions. Made from premium silk with intricate lace details.',
    price: 299.99,
    category: 'women',
    subcategory: 'dresses',
    brand: 'Luxe Fashion',
    image_url: '/api/placeholder/400/600',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Burgundy'],
    stock_quantity: 15,
    is_sale: true,
    sale_price: 199.99,
    rating: 4.8,
    review_count: 24,
    tags: ['evening', 'formal', 'silk', 'elegant', 'special occasion']
  },
  {
    name: 'Casual Summer Blouse',
    description: 'Light and breezy cotton blouse perfect for summer days. Features a relaxed fit and beautiful floral print.',
    price: 79.99,
    category: 'women',
    subcategory: 'tops',
    brand: 'Summer Breeze',
    image_url: '/api/placeholder/400/600',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Pink', 'Blue', 'Yellow'],
    stock_quantity: 25,
    is_sale: false,
    sale_price: null,
    rating: 4.5,
    review_count: 18,
    tags: ['casual', 'summer', 'cotton', 'floral', 'comfortable']
  },
  {
    name: 'Designer Skinny Jeans',
    description: 'Premium denim skinny jeans with stretch comfort. Classic design that pairs with any top.',
    price: 129.99,
    category: 'women',
    subcategory: 'bottoms',
    brand: 'Denim Co.',
    image_url: '/api/placeholder/400/600',
    sizes: ['24', '25', '26', '27', '28', '29', '30', '32'],
    colors: ['Dark Blue', 'Light Blue', 'Black'],
    stock_quantity: 30,
    is_sale: false,
    sale_price: null,
    rating: 4.6,
    review_count: 42,
    tags: ['denim', 'skinny', 'stretch', 'classic', 'versatile']
  },
  {
    name: 'Classic Business Suit',
    description: 'Tailored business suit made from premium wool. Perfect for professional settings and formal events.',
    price: 499.99,
    category: 'men',
    subcategory: 'suits',
    brand: 'Executive Style',
    image_url: '/api/placeholder/400/600',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Charcoal', 'Black'],
    stock_quantity: 12,
    is_sale: true,
    sale_price: 399.99,
    rating: 4.9,
    review_count: 31,
    tags: ['business', 'formal', 'wool', 'tailored', 'professional']
  },
  {
    name: 'Casual Cotton Polo',
    description: 'Comfortable cotton polo shirt perfect for casual outings and weekend activities.',
    price: 59.99,
    category: 'men',
    subcategory: 'tops',
    brand: 'Casual Kings',
    image_url: '/api/placeholder/400/600',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Navy', 'Red', 'Green', 'Gray'],
    stock_quantity: 40,
    is_sale: false,
    sale_price: null,
    rating: 4.3,
    review_count: 27,
    tags: ['casual', 'cotton', 'polo', 'comfortable', 'weekend']
  },
  {
    name: 'Premium Chinos',
    description: 'Slim-fit chinos made from high-quality cotton twill. Versatile pants for both casual and smart-casual looks.',
    price: 89.99,
    category: 'men',
    subcategory: 'bottoms',
    brand: 'Urban Fit',
    image_url: '/api/placeholder/400/600',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Khaki', 'Navy', 'Black', 'Gray'],
    stock_quantity: 35,
    is_sale: false,
    sale_price: null,
    rating: 4.4,
    review_count: 19,
    tags: ['chinos', 'slim-fit', 'versatile', 'cotton', 'smart-casual']
  },
  {
    name: 'Leather Handbag',
    description: 'Genuine leather handbag with multiple compartments. Perfect for work or everyday use.',
    price: 199.99,
    category: 'accessories',
    subcategory: 'bags',
    brand: 'Leather Craft',
    image_url: '/api/placeholder/400/600',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tan'],
    stock_quantity: 20,
    is_sale: false,
    sale_price: null,
    rating: 4.7,
    review_count: 33,
    tags: ['leather', 'handbag', 'work', 'everyday', 'genuine leather']
  },
  {
    name: 'Luxury Watch',
    description: 'Stainless steel watch with automatic movement. A timeless piece for any outfit.',
    price: 349.99,
    category: 'accessories',
    subcategory: 'watches',
    brand: 'Time Masters',
    image_url: '/api/placeholder/400/600',
    sizes: ['One Size'],
    colors: ['Silver', 'Gold', 'Black'],
    stock_quantity: 8,
    is_sale: true,
    sale_price: 279.99,
    rating: 4.9,
    review_count: 15,
    tags: ['luxury', 'watch', 'stainless steel', 'automatic', 'timeless']
  },
  {
    name: 'Designer Sunglasses',
    description: 'UV protection sunglasses with polarized lenses. Stylish and functional.',
    price: 149.99,
    category: 'accessories',
    subcategory: 'eyewear',
    brand: 'Sun Shield',
    image_url: '/api/placeholder/400/600',
    sizes: ['One Size'],
    colors: ['Black', 'Tortoise', 'Silver'],
    stock_quantity: 25,
    is_sale: false,
    sale_price: null,
    rating: 4.2,
    review_count: 21,
    tags: ['sunglasses', 'UV protection', 'polarized', 'designer', 'stylish']
  },
  {
    name: 'Wool Winter Scarf',
    description: 'Soft wool scarf perfect for cold weather. Available in various colors and patterns.',
    price: 39.99,
    category: 'accessories',
    subcategory: 'scarves',
    brand: 'Winter Warmth',
    image_url: '/api/placeholder/400/600',
    sizes: ['One Size'],
    colors: ['Red', 'Blue', 'Gray', 'Beige'],
    stock_quantity: 50,
    is_sale: true,
    sale_price: 29.99,
    rating: 4.1,
    review_count: 12,
    tags: ['wool', 'winter', 'scarf', 'warm', 'soft']
  }
];

async function insertSampleData() {
  console.log('🚀 Starting sample data insertion...');

  try {
    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing products:', checkError);
      return;
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log('ℹ️ Products already exist in database. Skipping insertion.');
      return;
    }

    // Insert sample products
    const { data, error } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();

    if (error) {
      console.error('❌ Error inserting sample data:', error);
      return;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} sample products!`);
    console.log('📦 Sample products added:');
    data?.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.category})`);
    });

  } catch (error) {
    console.error('💥 Error during sample data insertion:', error);
  }
}

// Run the function
insertSampleData();
