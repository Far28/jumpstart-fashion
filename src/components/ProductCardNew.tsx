import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
  sizes?: string[];
  colors?: string[];
}

interface ProductCardProps {
  product: Product;
  showFullDescription?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showFullDescription = false 
}) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  // Helper function to get correct image path
  const getImageUrl = (imageName: string) => {
    if (!imageName) return '/placeholder.svg';
    if (imageName.startsWith('http')) return imageName; // Already a full URL
    const base = import.meta.env.BASE_URL || '/';
    return `${base}images/${imageName}`;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    // Simple add to cart - sizes/colors will be selected on product detail page
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.is_sale && product.sale_price ? product.sale_price : product.price,
      image: product.image_url || '/placeholder.svg',
      quantity: 1
    };

    addToCart(cartItem);
    toast({
      title: "Added to cart!",
      description: `${product.name} added to your cart.`,
    });
  };

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from wishlist" : "Added to wishlist",
      description: isLiked 
        ? `${product.name} removed from your wishlist.`
        : `${product.name} added to your wishlist.`,
    });
  };

  const displayPrice = product.is_sale && product.sale_price ? product.sale_price : product.price;
  const discountPercentage = product.is_sale && product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} className="block">
      <Card className="group card-fashion hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md bg-white">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-t-xl">
            <img
              src={getImageUrl(product.image_url) || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.is_sale && (
                <Badge className="bg-red-500 text-white font-semibold">
                  -{discountPercentage}% OFF
                </Badge>
              )}
              {product.rating >= 4.5 && (
                <Badge className="bg-yellow-500 text-white font-semibold">
                  ⭐ Top Rated
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={toggleLike}
                variant="secondary"
                size="icon"
                className={`rounded-full w-10 h-10 ${isLiked ? 'bg-red-100 text-red-600' : 'bg-white/90'}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Quick Add to Cart Button */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={handleAddToCart}
                className="bg-black text-white hover:bg-gray-800 rounded-full px-4 py-2 text-sm font-medium"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-5 space-y-3">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                {product.brand}
              </p>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-gray-700 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.review_count} reviews)
              </span>
            </div>

            {/* Description */}
            {showFullDescription && product.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-900">
                ${displayPrice.toFixed(2)}
              </span>
              {product.is_sale && product.sale_price && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <Badge variant="outline" className="text-green-600 border-green-600">
              In Stock
            </Badge>

            {/* View Details Button */}
            <Button 
              className="w-full bg-gray-900 hover:bg-black text-white font-medium py-3 transition-colors duration-200"
              asChild
            >
              <span>View Details & Reviews</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
