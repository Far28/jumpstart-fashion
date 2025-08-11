import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  category: string;
  image_url?: string;
  description?: string;
}

export const SearchDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearchTerm = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchProducts(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (term: string) => {
    setQuery(term);
    if (term.trim()) {
      saveSearchTerm(term.trim());
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for products, categories, or styles..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearRecentSearches}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSearch(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                {loading ? 'Searching...' : `${results.length} results found`}
              </h3>
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {results.map((product) => (
                  <Link 
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                      {product.image_url && (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 capitalize">
                        {product.category}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {product.sale_price ? (
                          <>
                            <span className="text-sm font-semibold text-red-600">
                              ${product.sale_price}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ${product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-gray-900">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                
                {!loading && query && results.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p>No products found for "{query}"</p>
                    <p className="text-sm">Try searching for something else</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
