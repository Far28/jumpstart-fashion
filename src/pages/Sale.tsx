import { useState, useEffect } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { ProductCard } from '@/components/ProductCardFinal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, X, Percent } from 'lucide-react';

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
  category: string;
  subcategory?: string;
  tags?: string[];
}

export default function Sale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('discount');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [discountRange, setDiscountRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['women', 'men', 'accessories'];

  // Helper function to get correct image path
  const getImageUrl = (imageName: string) => {
    if (!imageName) return '/placeholder.svg';
    if (imageName.startsWith('http')) return imageName; // Already a full URL
    
    // Remove any leading slashes or 'images/' prefix from imageName
    const cleanImageName = imageName.replace(/^(\/|images\/)+/, '');
    
    const base = import.meta.env.BASE_URL;
    
    // Simple and reliable path construction
    const finalUrl = `${base}images/${cleanImageName}`;
    
    return finalUrl;
  };

  // Sample sale products with exact image names from public/images folder
  const sampleSaleProducts: Product[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440301',
      name: 'Cashmere Wrap Cardigan',
      description: 'Luxurious cashmere cardigan in blush pink',
      price: 398,
      sale_price: 239,
      is_sale: true,
      image_url: getImageUrl('Cashmere Wrap Cardigan.jpg'),
      rating: 4.8,
      review_count: 42,
      brand: 'CASHMERE DREAMS',
      category: 'women',
      subcategory: 'outerwear',
      tags: ['cashmere', 'cardigan', 'luxury']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440302',
      name: 'Floral Wrap Maxi Dress',
      description: 'Flowing maxi dress with botanical print',
      price: 285,
      sale_price: 171,
      is_sale: true,
      image_url: getImageUrl('Floral Wrap Maxi Dress.jpg'),
      rating: 4.6,
      review_count: 38,
      brand: 'BLOOM & CO',
      category: 'women',
      subcategory: 'dresses',
      tags: ['floral', 'maxi', 'wrap']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440303',
      name: 'Leather Ankle Boots',
      description: 'Premium leather boots with block heel',
      price: 245,
      sale_price: 147,
      is_sale: true,
      image_url: getImageUrl('Leather Ankle Boots.jpg'),
      rating: 4.7,
      review_count: 29,
      brand: 'STEP CLASSIC',
      category: 'women',
      subcategory: 'shoes',
      tags: ['leather', 'ankle', 'boots']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440304',
      name: 'Merino Wool V-Neck Sweater',
      description: 'Classic v-neck sweater in charcoal grey',
      price: 165,
      sale_price: 99,
      is_sale: true,
      image_url: getImageUrl('Merino Wool V-Neck Sweater.jpg'),
      rating: 4.6,
      review_count: 45,
      brand: 'WOOL & CO',
      category: 'men',
      subcategory: 'tops',
      tags: ['merino', 'v-neck', 'sweater']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440305',
      name: 'Denim Trucker Jacket',
      description: 'Classic denim jacket in stonewashed blue',
      price: 125,
      sale_price: 75,
      is_sale: true,
      image_url: getImageUrl('Denim Trucker Jacket.jpg'),
      rating: 4.3,
      review_count: 47,
      brand: 'DENIM CLASSIC',
      category: 'men',
      subcategory: 'outerwear',
      tags: ['denim', 'trucker', 'stonewashed']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440306',
      name: 'Designer Sunglasses',
      description: 'Vintage-inspired frames with UV protection',
      price: 225,
      sale_price: 135,
      is_sale: true,
      image_url: getImageUrl('Designer Sunglasses.jpg'),
      rating: 4.5,
      review_count: 39,
      brand: 'SHADE STYLE',
      category: 'accessories',
      subcategory: 'sunglasses',
      tags: ['designer', 'vintage', 'uv']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440307',
      name: 'Crossbody Phone Bag',
      description: 'Compact crossbody bag for essentials',
      price: 75,
      sale_price: 45,
      is_sale: true,
      image_url: getImageUrl('Crossbody Phone Bag.jpg'),
      rating: 4.2,
      review_count: 56,
      brand: 'MINI BAGS',
      category: 'accessories',
      subcategory: 'bags',
      tags: ['crossbody', 'phone', 'compact']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440308',
      name: 'Bohemian Kimono Jacket',
      description: 'Flowing kimono with paisley print',
      price: 145,
      sale_price: 87,
      is_sale: true,
      image_url: getImageUrl('Bohemian Kimono Jacket.jpg'),
      rating: 4.4,
      review_count: 34,
      brand: 'BOHO CHIC',
      category: 'women',
      subcategory: 'outerwear',
      tags: ['kimono', 'bohemian', 'paisley']
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, [sortBy, categoryFilter, discountRange, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_sale', true)
        .not('sale_price', 'is', null);

      // Apply filters
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      console.log('Database sale data:', data); // Debug log
      console.log('Sale data length:', data?.length); // Debug log

      // Force use sample sale data for now (to debug)
      let productsToDisplay = sampleSaleProducts;

      // Apply client-side filtering to sample data
      productsToDisplay = sampleSaleProducts.filter(product => {
        // Filter by category
        if (categoryFilter !== 'all' && product.category !== categoryFilter) {
          return false;
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

      // Apply discount range filter
      if (discountRange !== 'all') {
        productsToDisplay = productsToDisplay.filter(product => {
          if (!product.sale_price) return false;
          const discount = Math.round(((product.price - product.sale_price) / product.price) * 100);
          const [min, max] = discountRange.split('-').map(Number);
          if (max) {
            return discount >= min && discount <= max;
          } else {
            return discount >= min;
          }
        });
      }

      // Apply client-side sorting to sample data
      switch (sortBy) {
        case 'discount':
          productsToDisplay.sort((a, b) => {
            const discountA = a.sale_price ? ((a.price - a.sale_price) / a.price) * 100 : 0;
            const discountB = b.sale_price ? ((b.price - b.sale_price) / b.price) * 100 : 0;
            return discountB - discountA;
          });
          break;
        case 'price_low':
          productsToDisplay.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
          break;
        case 'price_high':
          productsToDisplay.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
          break;
        case 'rating':
          productsToDisplay.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // No created_at for sample data
          break;
        default:
          productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
      }

      console.log('Final sale products to display:', productsToDisplay); // Debug log
      setProducts(productsToDisplay);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      // Fallback to sample data on error
      setProducts(sampleSaleProducts);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('discount');
    setCategoryFilter('all');
    setDiscountRange('all');
  };

  const activeFiltersCount = [
    searchTerm,
    sortBy !== 'discount' ? sortBy : null,
    categoryFilter !== 'all' ? categoryFilter : null,
    discountRange !== 'all' ? discountRange : null,
  ].filter(Boolean).length;

  const totalSavings = products.reduce((total, product) => {
    if (product.sale_price) {
      return total + (product.price - product.sale_price);
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-4">
            <Percent className="h-4 w-4" />
            <span className="font-medium">Limited Time Sale</span>
          </div>
          <h1 className="text-4xl font-bold hero-text mb-4">Sale Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't miss out on these incredible deals! Save big on your favorite fashion items.
          </p>
          {totalSavings > 0 && (
            <div className="mt-4">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Total potential savings: ${totalSavings.toFixed(2)}
              </Badge>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sale items..."
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
                      <SelectItem value="discount">Biggest Discount</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Discount Range</label>
                  <Select value={discountRange} onValueChange={setDiscountRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Discounts</SelectItem>
                      <SelectItem value="10-25">10% - 25% Off</SelectItem>
                      <SelectItem value="25-50">25% - 50% Off</SelectItem>
                      <SelectItem value="50-75">50% - 75% Off</SelectItem>
                      <SelectItem value="75">75%+ Off</SelectItem>
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
                Showing {products.length} sale item{products.length !== 1 ? 's' : ''}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No sale items found</h3>
              <p className="text-gray-600 mb-6">
                There are currently no items on sale matching your criteria. Check back soon for new deals!
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