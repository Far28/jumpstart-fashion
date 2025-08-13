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

export default function Women() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const subcategories = [
    'dresses', 'tops', 'bottoms', 'outerwear', 'activewear', 
    'lingerie', 'shoes', 'bags', 'jewelry'
  ];

  // Helper function to get correct image path
  const getImageUrl = (imageName: string) => {
    if (!imageName) return '/placeholder.svg';
    if (imageName.startsWith('http')) return imageName; // Already a full URL
    
    // Remove any leading slashes or 'images/' prefix from imageName
    const cleanImageName = imageName.replace(/^(\/|images\/)+/, '');
    
    const base = import.meta.env.BASE_URL || '/';
    return `${base}images/${cleanImageName}`;
  };

  // Sample women's products with diverse names and categories
  const sampleProducts: Product[] = [
    // Dresses
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Aurora Velvet Evening Gown',
      description: 'Stunning velvet gown with delicate beadwork',
      price: 445,
      sale_price: 356,
      is_sale: true,
      image_url: 'https://images.unsplash.com/photo-1566479179817-c0eb6d2dc3b0?w=400&h=400&fit=crop',
      rating: 4.9,
      review_count: 31,
      brand: 'EVENING GRACE',
      subcategory: 'dresses',
      tags: ['velvet', 'beaded', 'formal']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Meadow Chiffon Midi Dress',
      description: 'Lightweight chiffon dress with watercolor print',
      price: 195,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=400&h=400&fit=crop',
      rating: 4.7,
      review_count: 22,
      brand: 'GARDEN PARTY',
      subcategory: 'dresses',
      tags: ['chiffon', 'midi', 'printed']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Midnight Satin Slip Dress',
      description: 'Minimalist satin dress for effortless elegance',
      price: 229,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
      rating: 4.8,
      review_count: 38,
      brand: 'MINIMALIST',
      subcategory: 'dresses',
      tags: ['satin', 'slip', 'minimalist']
    },
    // Tops
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Alpaca Wool Turtleneck',
      description: 'Ultra-soft alpaca wool turtleneck sweater',
      price: 298,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=400&h=400&fit=crop',
      rating: 4.8,
      review_count: 27,
      brand: 'ALPINE KNITS',
      subcategory: 'tops',
      tags: ['alpaca', 'turtleneck', 'luxury']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      name: 'Embroidered Peasant Blouse',
      description: 'Romantic blouse with intricate embroidery details',
      price: 165,
      is_sale: false,
      image_url: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop',
      rating: 4.6,
      review_count: 19,
      brand: 'ARTISAN CRAFT',
      subcategory: 'tops',
      tags: ['embroidered', 'peasant', 'romantic']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      name: 'Organic Cotton Henley',
      description: 'Sustainable henley top in organic cotton',
      price: 58,
      sale_price: 42,
      is_sale: true,
      image_url: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&h=400&fit=crop',
      rating: 4.4,
      review_count: 33,
      brand: 'ECO BASICS',
      subcategory: 'tops',
      tags: ['organic', 'henley', 'sustainable']
    },
    // Bottoms
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      name: 'Pleated Palazzo Pants',
      description: 'Flowing palazzo pants with elegant pleating',
      price: 189,
      is_sale: false,
      image_url: getImageUrl('pleated plazo pants.png'),
      rating: 4.7,
      review_count: 25,
      brand: 'FLOW FASHION',
      subcategory: 'bottoms',
      tags: ['palazzo', 'pleated', 'flowing']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      name: 'Raw Hem Boyfriend Jeans',
      description: 'Relaxed fit jeans with trendy raw hem detail',
      price: 125,
      is_sale: false,
      image_url: getImageUrl('Raw Hem Boyfriend Jeans.png'),
      rating: 4.5,
      review_count: 41,
      brand: 'URBAN EDGE',
      subcategory: 'bottoms',
      tags: ['boyfriend', 'raw-hem', 'relaxed']
    },
    // Outerwear
    {
      id: '550e8400-e29b-41d4-a716-446655440009',
      name: 'Double-Breasted Trench Coat',
      description: 'Classic trench coat with modern silhouette',
      price: 389,
      is_sale: false,
      image_url: getImageUrl('doublebreastedtrenchcoat.jpg'),
      rating: 4.9,
      review_count: 29,
      brand: 'CLASSIC COATS',
      subcategory: 'outerwear',
      tags: ['trench', 'double-breasted', 'classic']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440010',
      name: 'Faux Fur Cropped Jacket',
      description: 'Luxurious faux fur jacket in cropped style',
      price: 275,
      sale_price: 206,
      is_sale: true,
      image_url: getImageUrl('fauxfurjacket.jpg'),
      rating: 4.6,
      review_count: 18,
      brand: 'FUR LUXE',
      subcategory: 'outerwear',
      tags: ['faux-fur', 'cropped', 'luxurious']
    },
    // Shoes
    {
      id: '550e8400-e29b-41d4-a716-446655440011',
      name: 'Pointed Toe Stiletto Pumps',
      description: 'Sophisticated pumps with comfortable padding',
      price: 245,
      is_sale: false,
      image_url: getImageUrl('Pointed Toe Stiletto Pumps.jpg'),
      rating: 4.7,
      review_count: 36,
      brand: 'STEP ELEGANCE',
      subcategory: 'shoes',
      tags: ['stiletto', 'pointed-toe', 'sophisticated']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440012',
      name: 'Platform Espadrille Sandals',
      description: 'Comfortable platform sandals with rope detailing',
      price: 155,
      is_sale: false,
      image_url: getImageUrl('Platform Espadrille Sandals.jpg'),
      rating: 4.5,
      review_count: 28,
      brand: 'SUMMER STEPS',
      subcategory: 'shoes',
      tags: ['espadrille', 'platform', 'rope']
    },
    // Bags
    {
      id: '550e8400-e29b-41d4-a716-446655440013',
      name: 'Quilted Chain Shoulder Bag',
      description: 'Elegant quilted bag with gold chain strap',
      price: 325,
      is_sale: false,
      image_url: getImageUrl('image.png'),
      rating: 4.8,
      review_count: 24,
      brand: 'LUXURY BAGS',
      subcategory: 'bags',
      tags: ['quilted', 'chain', 'shoulder']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440014',
      name: 'Woven Straw Bucket Bag',
      description: 'Handwoven straw bag perfect for summer',
      price: 98,
      sale_price: 78,
      is_sale: true,
      image_url: getImageUrl('Woven Straw Bucket Bag.jpg'),
      rating: 4.4,
      review_count: 32,
      brand: 'BEACH STYLE',
      subcategory: 'bags',
      tags: ['straw', 'woven', 'bucket']
    },
    // Jewelry
    {
      id: '550e8400-e29b-41d4-a716-446655440015',
      name: 'Vintage-Inspired Cuff Bracelet',
      description: 'Ornate cuff bracelet with vintage details',
      price: 125,
      is_sale: false,
      image_url: getImageUrl('Vintage-Inspired Cuff Bracelet.png'),
      rating: 4.6,
      review_count: 21,
      brand: 'VINTAGE VIBES',
      subcategory: 'jewelry',
      tags: ['vintage', 'cuff', 'ornate']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440016',
      name: 'Diamond-Cut Hoop Earrings',
      description: 'Sparkling diamond-cut hoops in sterling silver',
      price: 89,
      is_sale: false,
      image_url: getImageUrl('diamondcuthoop.jpg'),
      rating: 4.7,
      review_count: 45,
      brand: 'SPARKLE CO',
      subcategory: 'jewelry',
      tags: ['diamond-cut', 'hoops', 'sterling']
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
        .eq('category', 'women');

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

      console.log('Database data:', data); // Debug log
      console.log('Data length:', data?.length); // Debug log

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

      console.log('Final products to display:', productsToDisplay); // Debug log
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
          <h1 className="text-4xl font-bold hero-text mb-4">Women's Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of women's fashion, from elegant dresses to stylish accessories.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search women's products..."
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