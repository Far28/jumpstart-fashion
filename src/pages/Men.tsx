import { useState, useEffect } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { ProductCard } from '@/components/ProductCardFinal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, X } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const subcategories = [
    'shirts', 'pants', 'suits', 'outerwear', 'activewear', 
    'underwear', 'shoes', 'accessories', 'watches'
  ];

  // Helper function to get correct image path
  const getImageUrl = (imageName: string) => {
    const base = import.meta.env.BASE_URL || '/';
    return `${base}images/${imageName}`;
  };

  // Sample men's products with diverse names and categories
  const sampleProducts: Product[] = [
    // Shirts
    {
      id: '550e8400-e29b-41d4-a716-446655440101',
      name: 'Oxford Button-Down Shirt',
      description: 'Classic oxford shirt with refined tailoring',
      price: 129,
      is_sale: false,
      image_url: getImageUrl('Oxford Button-Down Shirt.jpg'),
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
      image_url: getImageUrl('Linen Weekend Shirt.jpg'),
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
      image_url: getImageUrl('Stretch Chino Trousers.jpg'),
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
      image_url: getImageUrl('Slim-Fit Dark Wash Jeans.jpg'),
      rating: 4.8,
      review_count: 56,
      brand: 'DENIM MASTERS',
      subcategory: 'pants',
      tags: ['jeans', 'slim-fit', 'dark-wash']
    },
    // Suits
    {
      id: '550e8400-e29b-41d4-a716-446655440105',
      name: 'Navy Wool Business Suit',
      description: 'Sharp business suit in premium wool',
      price: 899,
      sale_price: 719,
      is_sale: true,
      image_url: getImageUrl('Navy Wool Business Suit.jpg'),
      rating: 4.9,
      review_count: 23,
      brand: 'EXECUTIVE STYLE',
      subcategory: 'suits',
      tags: ['navy', 'wool', 'business']
    },
    // Outerwear
    {
      id: '550e8400-e29b-41d4-a716-446655440106',
      name: 'Quilted Bomber Jacket',
      description: 'Modern bomber with quilted detailing',
      price: 249,
      is_sale: false,
      image_url: getImageUrl('Quilted Bomber Jacket.jpg'),
      rating: 4.6,
      review_count: 31,
      brand: 'URBAN LAYER',
      subcategory: 'outerwear',
      tags: ['bomber', 'quilted', 'modern']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440107',
      name: 'Wool Pea Coat',
      description: 'Classic naval-inspired wool coat',
      price: 379,
      is_sale: false,
      image_url: getImageUrl('Wool Pea Coat.jpg'),
      rating: 4.8,
      review_count: 19,
      brand: 'NAVAL HERITAGE',
      subcategory: 'outerwear',
      tags: ['pea-coat', 'wool', 'naval']
    },
    // Shoes
    {
      id: '550e8400-e29b-41d4-a716-446655440108',
      name: 'Leather Dress Oxfords',
      description: 'Handcrafted leather oxfords for formal occasions',
      price: 299,
      is_sale: false,
      image_url: getImageUrl('Leather Dress Oxfords.jpg'),
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
      image_url: getImageUrl('Canvas High-Top Sneakers.jpg'),
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
      description: 'Professional messenger bag in genuine leather',
      price: 225,
      is_sale: false,
      image_url: getImageUrl('Leather Messenger Bag.jpg'),
      rating: 4.8,
      review_count: 26,
      brand: 'WORK GEAR',
      subcategory: 'accessories',
      tags: ['messenger', 'leather', 'professional']
    },
    // Watches
    {
      id: '550e8400-e29b-41d4-a716-446655440111',
      name: 'Minimalist Steel Watch',
      description: 'Clean design watch with stainless steel band',
      price: 189,
      is_sale: false,
      image_url: getImageUrl('Minimalist Steel Watch.jpg'),
      rating: 4.6,
      review_count: 44,
      brand: 'TIME PIECE',
      subcategory: 'watches',
      tags: ['minimalist', 'steel', 'classic']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440112',
      name: 'Vintage Leather Strap Watch',
      description: 'Retro-inspired watch with aged leather strap',
      price: 149,
      sale_price: 119,
      is_sale: true,
      image_url: getImageUrl('Vintage Leather Strap Watch.jpg'),
      rating: 4.5,
      review_count: 33,
      brand: 'VINTAGE TIME',
      subcategory: 'watches',
      tags: ['vintage', 'leather-strap', 'retro']
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, [sortBy, priceRange, selectedSubcategory, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('category', 'men');

      // Apply filters
      if (selectedSubcategory !== 'all') {
        query = query.eq('subcategory', selectedSubcategory);
      }

      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('name', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      console.log('Men Database data:', data); // Debug log
      console.log('Men Data length:', data?.length); // Debug log

      // Force use sample data for now (to debug)
      let productsToDisplay = sampleProducts;

      // Apply client-side filtering to sample data
      productsToDisplay = sampleProducts.filter(product => {
        // Filter by subcategory
        if (selectedSubcategory !== 'all' && product.subcategory !== selectedSubcategory) {
          return false;
        }

        // Filter by price range
        if (priceRange !== 'all') {
          const [min, max] = priceRange.split('-').map(Number);
          if (max && (product.price < min || product.price > max)) {
            return false;
          } else if (!max && product.price < min) {
            return false;
          }
        }

        // Filter by search term
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            product.name.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower) ||
            product.brand?.toLowerCase().includes(searchLower)
          );
        }

        return true;
      });

      // Apply client-side sorting to sample data
      productsToDisplay.sort((a, b) => {
        switch (sortBy) {
          case 'price_low':
            return a.price - b.price;
          case 'price_high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return 0; // No created_at for sample data
          default:
            return a.name.localeCompare(b.name);
        }
      });

      console.log('Men Final products to display:', productsToDisplay); // Debug log
      setProducts(productsToDisplay);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to sample data on error
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setPriceRange('all');
    setSelectedSubcategory('all');
  };

  const activeFiltersCount = [
    searchTerm,
    sortBy !== 'name' ? sortBy : null,
    priceRange !== 'all' ? priceRange : null,
    selectedSubcategory !== 'all' ? selectedSubcategory : null,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold hero-text mb-4">Men's Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our premium men's fashion collection, featuring contemporary styles and timeless classics.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search men's products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="card-fashion p-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {subcategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-25">Under $25</SelectItem>
                      <SelectItem value="25-50">$25 - $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-200">$100 - $200</SelectItem>
                      <SelectItem value="200">$200+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-80 mb-4"></div>
                <div className="space-y-3">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-auto border-0 bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} showFullDescription={false} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching your criteria. Try adjusting your filters.
              </p>
              <Button onClick={clearFilters} size="lg">
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}