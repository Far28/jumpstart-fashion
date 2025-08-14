import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Your order of ${getTotalItems()} items totaling $${getTotalPrice().toFixed(2)} has been placed.`,
      });
      clearCart();
      setIsCheckingOut(false);
    }, 2000);
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Button size="lg" asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Badge variant="secondary">{getTotalItems()} items</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0">
                      {item.product?.image_url && (
                        <img 
                          src={getImageUrl(item.product.image_url)} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.product?.name}
                      </h3>
                      {item.size && (
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-600">Color: {item.color}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        {item.product?.is_sale && item.product?.sale_price ? (
                          <>
                            <span className="text-lg font-semibold text-red-600">
                              ${item.product.sale_price}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ${item.product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-semibold text-gray-900">
                            ${item.product?.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promo Code */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-green-50 p-3 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      {shipping === 0 
                        ? "Free shipping on orders over $100!" 
                        : `Add $${(100 - subtotal).toFixed(2)} more for free shipping`
                      }
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isCheckingOut ? "Processing..." : `Checkout - $${total.toFixed(2)}`}
                </Button>

                {!user && (
                  <p className="text-sm text-gray-600 text-center">
                    <Link to="/auth" className="text-blue-600 hover:underline">
                      Sign in
                    </Link> for faster checkout
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Security Badges */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <h4 className="font-semibold text-sm">Secure Checkout</h4>
                  <div className="flex justify-center space-x-4 text-xs text-gray-600">
                    <span>🔒 SSL Encrypted</span>
                    <span>💳 Safe Payment</span>
                    <span>📦 Fast Shipping</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
