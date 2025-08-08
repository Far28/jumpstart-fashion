import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
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
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  const displayPrice = product.is_sale && product.sale_price ? product.sale_price : product.price;
  const discountPercentage = product.is_sale && product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group card-fashion hover:shadow-glow transition-all duration-300 cursor-pointer">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-t-xl">
            <img
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.is_sale && (
              <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                -{discountPercentage}%
              </Badge>
            )}
            <Button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              variant="secondary"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {product.brand && (
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {product.brand}
                  </p>
                )}
                <h3 className="font-medium text-sm line-clamp-2 text-foreground">
                  {product.name}
                </h3>
              </div>
            </div>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.review_count})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                ${displayPrice.toFixed(2)}
              </span>
              {product.is_sale && product.sale_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};