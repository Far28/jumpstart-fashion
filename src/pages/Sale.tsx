import { useState, useEffect } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { ProductCard } from '@/components/ProductCard';
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

      let filteredProducts = data || [];

      // Apply discount range filter
      if (discountRange !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
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

      // Apply sorting
      switch (sortBy) {
        case 'discount':
          filteredProducts.sort((a, b) => {
            const discountA = a.sale_price ? ((a.price - a.sale_price) / a.price) * 100 : 0;
            const discountB = b.sale_price ? ((b.price - b.sale_price) / b.price) * 100 : 0;
            return discountB - discountA;
          });
          break;
        case 'price_low':
          filteredProducts.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
          break;
        case 'price_high':
          filteredProducts.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // Already ordered by created_at desc if needed
          break;
        default:
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching sale products:', error);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-xl h-64 mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 rounded"></div>
                  <div className="bg-muted h-4 rounded w-3/4"></div>
                  <div className="bg-muted h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No sale items found</p>
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}