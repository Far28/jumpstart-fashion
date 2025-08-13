import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCardFinal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  SlidersHorizontal, 
  Grid3X3, 
  LayoutGrid, 
  ChevronDown,
  Filter
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  is_sale: boolean;
  image_url?: string;
  rating: number;
  review_count: number;
  brand?: string;
  subcategory?: string;
  tags?: string[];
}

export default function Men() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Helper function to get correct image path
  const getImageUrl = (imageName: string) => {
    if (!imageName) return '/placeholder.svg';
    if (imageName.startsWith('http')) return imageName; // Already a full URL
    
    // Remove any leading slashes or 'images/' prefix from imageName
    const cleanImageName = imageName.replace(/^(\/|images\/)+/, '');
    
    const base = import.meta.env.BASE_URL || '/';
    return `${base}images/${cleanImageName}`;
  };

  // Sample men's products with working Unsplash images
  const sampleProducts: Product[] = [
    // Shirts
    {
      id: '550e8400-e29b-41d4-a716-446655440101',
      name: 'Oxford Button-Down Shirt',
      description: 'Classic oxford shirt with refined tailoring',
      price: 129,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
      rating: 4.7,
      review_count: 34,
      brand: 'HERITAGE CLOTHIERS',
      subcategory: 'shirts',
      tags: ['oxford', 'classic', 'button-down']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440102',
      name: 'Linen Weekend Shirt',
      description: 'Breathable linen shirt for relaxed occasions',
      price: 89,
      sale_price: 69,
      is_sale: true,
      image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
      rating: 4.5,
      review_count: 28,
      brand: 'COASTAL STYLE',
      subcategory: 'shirts',
      tags: ['linen', 'casual', 'breathable']
    },
    // Pants
    {
      id: '550e8400-e29b-41d4-a716-446655440103',
      name: 'Stretch Chino Trousers',
      description: 'Versatile chinos with comfortable stretch fabric',
      price: 159,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
      rating: 4.6,
      review_count: 42,
      brand: 'MODERN FIT',
      subcategory: 'pants',
      tags: ['chino', 'stretch', 'versatile']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440104',
      name: 'Slim-Fit Dark Wash Jeans',
      description: 'Contemporary jeans with perfect fit',
      price: 179,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      rating: 4.8,
      review_count: 56,
      brand: 'DENIM MASTERS',
      subcategory: 'pants',
      tags: ['jeans', 'slim-fit', 'dark-wash']
    },
    // Outerwear
    {
      id: '550e8400-e29b-41d4-a716-446655440105',
      name: 'Quilted Bomber Jacket',
      description: 'Modern bomber with quilted details',
      price: 245,
      sale_price: 189,
      is_sale: true,
      image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      rating: 4.7,
      review_count: 29,
      brand: 'URBAN EDGE',
      subcategory: 'outerwear',
      tags: ['bomber', 'quilted', 'modern']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440106',
      name: 'Wool Pea Coat',
      description: 'Classic peacoat in navy wool blend',
      price: 395,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
      rating: 4.8,
      review_count: 45,
      brand: 'NAVAL TRADITION',
      subcategory: 'outerwear',
      tags: ['wool', 'peacoat', 'classic']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440107',
      name: 'Navy Wool Business Suit',
      description: 'Professional suit with modern tailoring',
      price: 795,
      sale_price: 595,
      is_sale: true,
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 4.9,
      review_count: 23,
      brand: 'EXECUTIVE STYLE',
      subcategory: 'suits',
      tags: ['suit', 'wool', 'business']
    },
    // Shoes
    {
      id: '550e8400-e29b-41d4-a716-446655440108',
      name: 'Leather Dress Oxfords',
      description: 'Handcrafted leather oxfords for formal occasions',
      price: 299,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      rating: 4.7,
      review_count: 38,
      brand: 'GENTLEMAN SHOES',
      subcategory: 'shoes',
      tags: ['oxford', 'leather', 'formal']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440109',
      name: 'Canvas High-Top Sneakers',
      description: 'Classic canvas sneakers with rubber sole',
      price: 119,
      sale_price: 89,
      is_sale: true,
      image_url: 'https://images.unsplash.com/photo-1560072663-d0b6b0e1b6e0?w=400&h=400&fit=crop',
      rating: 4.4,
      review_count: 67,
      brand: 'STREET CLASSIC',
      subcategory: 'shoes',
      tags: ['canvas', 'high-top', 'casual']
    },
    // Accessories
    {
      id: '550e8400-e29b-41d4-a716-446655440110',
      name: 'Leather Messenger Bag',
      description: 'Professional messenger bag in cognac leather',
      price: 285,
      sale_price: 199,
      is_sale: true,
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      rating: 4.6,
      review_count: 31,
      brand: 'EXECUTIVE CARRY',
      subcategory: 'bags',
      tags: ['messenger', 'leather', 'professional']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440111',
      name: 'Minimalist Steel Watch',
      description: 'Clean lines with Swiss movement',
      price: 425,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
      rating: 4.8,
      review_count: 44,
      brand: 'TIME PRECISE',
      subcategory: 'watches',
      tags: ['watch', 'steel', 'minimalist']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440112',
      name: 'Vintage Leather Strap Watch',
      description: 'Classic timepiece with aged leather strap',
      price: 189,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop',
      rating: 4.5,
      review_count: 39,
      brand: 'HERITAGE TIME',
      subcategory: 'watches',
      tags: ['vintage', 'leather', 'classic']
    }
  ];

  useEffect(() => {
    const fetchProducts = () => {
      try {
        console.log('Men Database data:', sampleProducts);
        console.log('Men Data length:', sampleProducts.length);
        
        setProducts(sampleProducts);
        setFilteredProducts(sampleProducts.slice(0, 12));
        console.log('Men Final products to display:', sampleProducts.slice(0, 12));
      } catch (error) {
        console.error('Error fetching men products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = products.filter(product => 
        product.subcategory === selectedCategory
      );
    }

    // Sort products
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => {
        const priceA = a.is_sale && a.sale_price ? a.sale_price : a.price;
        const priceB = b.is_sale && b.sale_price ? b.sale_price : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => {
        const priceA = a.is_sale && a.sale_price ? a.sale_price : a.price;
        const priceB = b.is_sale && b.sale_price ? b.sale_price : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy]);

  const categories = [
    { id: 'all', name: 'All Items', count: products.length },
    { id: 'shirts', name: 'Shirts', count: products.filter(p => p.subcategory === 'shirts').length },
    { id: 'pants', name: 'Pants', count: products.filter(p => p.subcategory === 'pants').length },
    { id: 'outerwear', name: 'Outerwear', count: products.filter(p => p.subcategory === 'outerwear').length },
    { id: 'shoes', name: 'Shoes', count: products.filter(p => p.subcategory === 'shoes').length },
    { id: 'suits', name: 'Suits', count: products.filter(p => p.subcategory === 'suits').length },
    { id: 'bags', name: 'Bags', count: products.filter(p => p.subcategory === 'bags').length },
    { id: 'watches', name: 'Watches', count: products.filter(p => p.subcategory === 'watches').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading men's collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Men's Collection
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Discover timeless pieces and contemporary styles crafted for the modern gentleman
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {category.count}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.find(c => c.id === selectedCategory)?.name || 'All Items'}
                </h2>
                <p className="text-gray-600">
                  {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-md p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white shadow-sm text-black'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white shadow-sm text-black'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    showFullDescription={viewMode === 'list'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <SlidersHorizontal className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}