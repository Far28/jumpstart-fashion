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
    if (!imageName) return '/placeholder.svg';
    if (imageName.startsWith('http')) return imageName; // Already a full URL
    
    // Remove any leading slashes or 'images/' prefix from imageName
    const cleanImageName = imageName.replace(/^(\/|images\/)+/, '');
    
    const base = import.meta.env.BASE_URL || '/';
    
    // Ensure base ends with slash and construct proper path
    const baseWithSlash = base.endsWith('/') ? base : `${base}/`;
    const finalUrl = `${baseWithSlash}images/${cleanImageName}`;
    
    return finalUrl;
  };

  // Sample men's products with exact image names from public/images folder
  const sampleProducts: Product[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440050',
      name: 'Oxford Button-Down Shirt',
      description: 'Classic Oxford cotton button-down shirt',
      price: 89,
      is_sale: false,
      image_url: getImageUrl('Oxford Button-Down Shirt.jpg'),
      rating: 4.5,
      review_count: 67,
      brand: 'CLASSIC FIT',
      subcategory: 'shirts',
      tags: ['oxford', 'cotton', 'formal']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440051',
      name: 'Linen Weekend Shirt',
      description: 'Relaxed linen shirt for casual weekends',
      price: 125,
      is_sale: false,
      image_url: getImageUrl('Linen Weekend Shirt.jpg'),
      rating: 4.3,
      review_count: 34,
      brand: 'COASTAL CASUAL',
      subcategory: 'shirts',
      tags: ['linen', 'casual', 'summer']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440053',
      name: 'Stretch Chino Trousers',
      description: 'Comfortable stretch chino pants',
      price: 95,
      is_sale: false,
      image_url: getImageUrl('Stretch Chino Trousers.jpg'),
      rating: 4.6,
      review_count: 45,
      brand: 'FLEX FIT',
      subcategory: 'pants',
      tags: ['chino', 'stretch', 'casual']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440054',
      name: 'Slim Fit Chino Pants',
      description: 'Navy blue slim fit chino pants',
      price: 85,
      is_sale: false,
      image_url: getImageUrl('Slim Fit Chino Pants in navy blue.jpg'),
      rating: 4.5,
      review_count: 52,
      brand: 'TAILORED FIT',
      subcategory: 'pants',
      tags: ['chino', 'slim', 'navy']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440055',
      name: 'Slim-Fit Dark Wash Jeans',
      description: 'Premium dark wash denim jeans',
      price: 115,
      is_sale: false,
      image_url: getImageUrl('Slim-Fit Dark Wash Jeans.jpg'),
      rating: 4.7,
      review_count: 78,
      brand: 'DENIM WORKS',
      subcategory: 'pants',
      tags: ['jeans', 'slim', 'dark wash']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440056',
      name: 'Quilted Bomber Jacket',
      description: 'Modern quilted bomber jacket',
      price: 185,
      is_sale: false,
      image_url: getImageUrl('Quilted Bomber Jacket.jpg'),
      rating: 4.4,
      review_count: 29,
      brand: 'STREET STYLE',
      subcategory: 'outerwear',
      tags: ['bomber', 'quilted', 'casual']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440057',
      name: 'Wool Pea Coat',
      description: 'Classic wool pea coat for winter',
      price: 298,
      is_sale: false,
      image_url: getImageUrl('Wool Pea Coat.jpg'),
      rating: 4.8,
      review_count: 41,
      brand: 'WINTER CLASSIC',
      subcategory: 'outerwear',
      tags: ['wool', 'pea coat', 'winter']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440058',
      name: 'Navy Wool Business Suit',
      description: 'Professional navy wool business suit',
      price: 595,
      is_sale: false,
      image_url: getImageUrl('Navy Wool Business Suit.jpg'),
      rating: 4.9,
      review_count: 18,
      brand: 'EXECUTIVE',
      subcategory: 'suits',
      tags: ['wool', 'navy', 'business']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440059',
      name: 'Leather Dress Oxfords',
      description: 'Premium leather Oxford dress shoes',
      price: 245,
      is_sale: false,
      image_url: getImageUrl('Leather Dress Oxfords.jpg'),
      rating: 4.6,
      review_count: 33,
      brand: 'CLASSIC LEATHER',
      subcategory: 'shoes',
      tags: ['leather', 'oxford', 'formal']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440060',
      name: 'Canvas High-Top Sneakers',
      description: 'Classic canvas high-top sneakers',
      price: 85,
      is_sale: false,
      image_url: getImageUrl('Canvas High-Top Sneakers.jpg'),
      rating: 4.3,
      review_count: 67,
      brand: 'STREET CLASSIC',
      subcategory: 'shoes',
      tags: ['canvas', 'sneakers', 'casual']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440061',
      name: 'Leather Messenger Bag',
      description: 'Professional leather messenger bag',
      price: 195,
      is_sale: false,
      image_url: getImageUrl('Leather Messenger Bag.jpg'),
      rating: 4.7,
      review_count: 24,
      brand: 'PROFESSIONAL',
      subcategory: 'accessories',
      tags: ['leather', 'messenger', 'business']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440062',
      name: 'Minimalist Steel Watch',
      description: 'Clean minimalist steel watch',
      price: 155,
      is_sale: false,
      image_url: getImageUrl('Minimalist Steel Watch.jpg'),
      rating: 4.5,
      review_count: 45,
      brand: 'TIME MINIMAL',
      subcategory: 'watches',
      tags: ['steel', 'minimalist', 'modern']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440063',
      name: 'Vintage Leather Strap Watch',
      description: 'Classic vintage-style leather strap watch',
      price: 135,
      is_sale: false,
      image_url: getImageUrl('Vintage Leather Strap Watch.jpg'),
      rating: 4.4,
      review_count: 38,
      brand: 'VINTAGE TIME',
      subcategory: 'watches',
      tags: ['leather', 'vintage', 'classic']
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use the sample men's products directly to show proper products
        console.log('Loading men products with proper data');
        setProducts(sampleProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error loading men products:', error);
        setProducts(sampleProducts);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply subcategory filter
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Apply price range filter
    if (priceRange === 'under-100') {
      filtered = filtered.filter(product => product.price < 100);
    } else if (priceRange === '100-200') {
      filtered = filtered.filter(product => product.price >= 100 && product.price <= 200);
    } else if (priceRange === '200-300') {
      filtered = filtered.filter(product => product.price >= 200 && product.price <= 300);
    } else if (priceRange === 'over-300') {
      filtered = filtered.filter(product => product.price > 300);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return filtered.reverse();
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setPriceRange('all');
    setSelectedSubcategory('all');
  };

  const hasActiveFilters = searchTerm !== '' || sortBy !== 'name' || priceRange !== 'all' || selectedSubcategory !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Men's Collection</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of men's fashion, from casual essentials to formal wear.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search men's products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {subcategories.map(subcategory => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-100">Under $100</SelectItem>
                      <SelectItem value="100-200">$100 - $200</SelectItem>
                      <SelectItem value="200-300">$200 - $300</SelectItem>
                      <SelectItem value="over-300">Over $300</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading men's products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts().map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* No products found */}
        {!loading && filteredAndSortedProducts().length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No products found matching your criteria.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear filters
            </Button>
          </div>
        )}

        {/* Results count */}
        {!loading && filteredAndSortedProducts().length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {filteredAndSortedProducts().length} of {products.length} products
          </div>
        )}
      </div>
    </div>
  );
}