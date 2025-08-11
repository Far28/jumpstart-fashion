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

export default function Accessories() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const subcategories = [
    'bags', 'jewelry', 'watches', 'sunglasses', 'hats', 
    'scarves', 'belts', 'wallets', 'tech'
  ];

  // Sample accessories products with diverse names and categories
  const sampleProducts: Product[] = [
    // Bags
    {
      id: '550e8400-e29b-41d4-a716-446655440201',
      name: 'Vintage Leather Satchel',
      description: 'Handcrafted leather satchel with brass hardware',
      price: 289,
      is_sale: false,
      image_url: '/images/Vintage Leather Satchel.jpg',
      rating: 4.8,
      review_count: 27,
      brand: 'HERITAGE BAGS',
      subcategory: 'bags',
      tags: ['leather', 'vintage', 'satchel']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440202',
      name: 'Canvas Weekender Bag',
      description: 'Spacious canvas bag perfect for weekend trips',
      price: 149,
      sale_price: 119,
      is_sale: true,
      image_url: '/images/Canvas Weekender Bag.jpg',
      rating: 4.6,
      review_count: 34,
      brand: 'TRAVEL ESSENTIALS',
      subcategory: 'bags',
      tags: ['canvas', 'weekender', 'travel']
    },
    // Jewelry
    {
      id: '550e8400-e29b-41d4-a716-446655440203',
      name: 'Sterling Silver Signet Ring',
      description: 'Classic signet ring in polished sterling silver',
      price: 179,
      is_sale: false,
      image_url: '/placeholder.svg',
      rating: 4.7,
      review_count: 22,
      brand: 'SILVER CRAFT',
      subcategory: 'jewelry',
      tags: ['sterling', 'signet', 'classic']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440204',
      name: 'Beaded Charm Bracelet',
      description: 'Artisan beaded bracelet with gold accents',
      price: 89,
      sale_price: 69,
      is_sale: true,
      image_url: '/images/Beaded Charm Bracelet.jpg',
      rating: 4.5,
      review_count: 41,
      brand: 'ARTISAN JEWELRY',
      subcategory: 'jewelry',
      tags: ['beaded', 'charm', 'artisan']
    },
    // Watches
    {
      id: '550e8400-e29b-41d4-a716-446655440205',
      name: 'Rose Gold Mesh Watch',
      description: 'Elegant watch with rose gold mesh band',
      price: 245,
      is_sale: false,
      image_url: '/images/Rose Gold Mesh Watch.jpg',
      rating: 4.8,
      review_count: 33,
      brand: 'LUXE TIME',
      subcategory: 'watches',
      tags: ['rose-gold', 'mesh', 'elegant']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440206',
      name: 'Smart Fitness Tracker',
      description: 'Advanced fitness tracker with health monitoring',
      price: 199,
      sale_price: 159,
      is_sale: true,
      image_url: '/images/Smart Fitness Tracker.jpg',
      rating: 4.4,
      review_count: 89,
      brand: 'TECH WEAR',
      subcategory: 'watches',
      tags: ['smart', 'fitness', 'tech']
    },
    // Sunglasses
    {
      id: '550e8400-e29b-41d4-a716-446655440207',
      name: 'Aviator Polarized Sunglasses',
      description: 'Classic aviator style with polarized lenses',
      price: 159,
      is_sale: false,
      image_url: '/images/Aviator Polarized Sunglasses.jpg',
      rating: 4.7,
      review_count: 28,
      brand: 'SKY VISION',
      subcategory: 'sunglasses',
      tags: ['aviator', 'polarized', 'classic']
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440208',
      name: 'Oversized Cat-Eye Frames',
      description: 'Trendy oversized sunglasses with UV protection',
      price: 129,
      sale_price: 99,
      is_sale: true,
      image_url: '/images/Oversized Cat-Eye Frames.jpg',
      rating: 4.5,
      review_count: 36,
      brand: 'FASHION EYES',
      subcategory: 'sunglasses',
      tags: ['cat-eye', 'oversized', 'trendy']
    },
    // Hats
    {
      id: '550e8400-e29b-41d4-a716-446655440209',
      name: 'Wide-Brim Fedora Hat',
      description: 'Stylish fedora with classic wide brim',
      price: 89,
      is_sale: false,
      image_url: '/images/Wide-Brim Fedora Hat.jpg',
      rating: 4.6,
      review_count: 19,
      brand: 'HAT COMPANY',
      subcategory: 'hats',
      tags: ['fedora', 'wide-brim', 'classic']
    },
    // Scarves
    {
      id: '550e8400-e29b-41d4-a716-446655440210',
      name: 'Cashmere Blend Winter Scarf',
      description: 'Luxurious cashmere blend scarf in neutral tones',
      price: 125,
      is_sale: false,
      image_url: '/images/Cashmere Blend Winter Scarf.jpg',
      rating: 4.8,
      review_count: 25,
      brand: 'WINTER WARMTH',
      subcategory: 'scarves',
      tags: ['cashmere', 'winter', 'neutral']
    },
    // Belts
    {
      id: '550e8400-e29b-41d4-a716-446655440211',
      name: 'Genuine Leather Belt',
      description: 'Classic leather belt with silver buckle',
      price: 79,
      sale_price: 59,
      is_sale: true,
      image_url: '/images/Genuine Leather Belt.jpg',
      rating: 4.5,
      review_count: 47,
      brand: 'LEATHER GOODS',
      subcategory: 'belts',
      tags: ['leather', 'classic', 'silver']
    },
    // Wallets
    {
      id: '550e8400-e29b-41d4-a716-446655440212',
      name: 'Minimalist Card Holder',
      description: 'Slim card holder with RFID protection',
      price: 49,
      is_sale: false,
      image_url: '/images/Minimalist Card Holder.jpg',
      rating: 4.6,
      review_count: 67,
      brand: 'MINIMAL GEAR',
      subcategory: 'wallets',
      tags: ['minimalist', 'RFID', 'slim']
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
        .eq('category', 'accessories');

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

      console.log('Accessories Database data:', data); // Debug log
      console.log('Accessories Data length:', data?.length); // Debug log

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

      console.log('Accessories Final products to display:', productsToDisplay); // Debug log
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
          <h1 className="text-4xl font-bold hero-text mb-4">Accessories Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Complete your look with our carefully selected accessories, from statement jewelry to practical tech.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search accessories..."
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
                We couldn't find any accessories matching your criteria. Try adjusting your filters.
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