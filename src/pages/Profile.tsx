import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { 
  User, 
  Heart, 
  Star, 
  ShoppingBag, 
  Settings, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Package,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit3,
  Trash2,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  image_url: string;
  brand: string;
  is_sale: boolean;
}

interface UserReview {
  id: string;
  product_id: string;
  product_name: string;
  rating: number;
  comment: string;
  created_at: string;
  product_image: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  items_count: number;
}

export default function Profile() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Sample data for demonstration
  useEffect(() => {
    // Load sample favorites
    setFavorites([
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Aurora Velvet Evening Gown',
        price: 445,
        sale_price: 356,
        image_url: '/images/auroravelvetgown.jpg',
        brand: 'Elegance',
        is_sale: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Cashmere Wrap Cardigan',
        price: 289,
        image_url: '/images/Cashmere Wrap Cardigan.jpg',
        brand: 'Luxury Knits',
        is_sale: false
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440101',
        name: 'Oxford Button-Down Shirt',
        price: 119,
        image_url: '/images/Oxford Button-Down Shirt.jpg',
        brand: 'Classic',
        is_sale: false
      }
    ]);

    // Load sample reviews
    setReviews([
      {
        id: '1',
        product_id: '550e8400-e29b-41d4-a716-446655440001',
        product_name: 'Aurora Velvet Evening Gown',
        rating: 5,
        comment: 'Absolutely stunning dress! The velvet quality is exceptional and the fit is perfect. Received so many compliments.',
        created_at: '2025-01-15',
        product_image: '/images/auroravelvetgown.jpg'
      },
      {
        id: '2',
        product_id: '550e8400-e29b-41d4-a716-446655440002',
        product_name: 'Cashmere Wrap Cardigan',
        rating: 4,
        comment: 'Very soft and comfortable. Great for layering. Only wish it came in more colors.',
        created_at: '2025-01-10',
        product_image: '/images/Cashmere Wrap Cardigan.jpg'
      }
    ]);

    // Load sample orders
    setOrders([
      {
        id: 'ORD-001',
        total: 578.50,
        status: 'Delivered',
        created_at: '2025-01-20',
        items_count: 3
      },
      {
        id: 'ORD-002',
        total: 289.00,
        status: 'Shipped',
        created_at: '2025-01-25',
        items_count: 1
      },
      {
        id: 'ORD-003',
        total: 445.00,
        status: 'Processing',
        created_at: '2025-02-01',
        items_count: 2
      }
    ]);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    
    const { error } = await updateProfile({
      first_name: firstName,
      last_name: lastName,
    });
    
    if (error) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      setIsEditing(false);
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
  };

  const removeFavorite = (productId: string) => {
    setFavorites(favorites.filter(item => item.id !== productId));
    toast({
      title: 'Removed from favorites',
      description: 'Item has been removed from your favorites.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-luxury rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {profile?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-light text-luxury mb-2">
                {profile?.first_name && profile?.last_name 
                  ? `${profile.first_name} ${profile.last_name}`
                  : user?.email
                }
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                {profile?.role || 'Customer'} • Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-fashion">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{orders.length}</p>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fashion">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{favorites.length}</p>
                      <p className="text-sm text-muted-foreground">Favorites</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fashion">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{reviews.length}</p>
                      <p className="text-sm text-muted-foreground">Reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-fashion">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card className="card-fashion">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">#{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()} • {order.items_count} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('orders')}>
                    View All Orders
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card className="card-fashion">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.slice(0, 2).map((review) => (
                    <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium text-sm">{review.product_name}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('reviews')}>
                    View All Reviews
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card className="card-fashion">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  My Favorites ({favorites.length})
                </CardTitle>
                <CardDescription>
                  Products you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground mb-4">Start browsing and add items to your favorites!</p>
                    <Link to="/women">
                      <Button>Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((product) => (
                      <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            {product.is_sale && (
                              <Badge className="absolute top-2 left-2 bg-red-500">
                                Sale
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                              onClick={() => removeFavorite(product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                              {product.brand}
                            </p>
                            <h3 className="font-medium mt-1 line-clamp-2">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="font-semibold">
                                ${product.sale_price || product.price}
                              </span>
                              {product.sale_price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${product.price}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Link to={`/products/${product.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </Link>
                              <Button size="sm" className="flex-1">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="card-fashion">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History ({orders.length})
                </CardTitle>
                <CardDescription>
                  Track and manage your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">Start shopping to see your orders here!</p>
                    <Link to="/women">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-luxury/10 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-luxury" />
                              </div>
                              <div>
                                <p className="font-semibold">Order #{order.id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <div className="mt-2">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card className="card-fashion">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  My Reviews ({reviews.length})
                </CardTitle>
                <CardDescription>
                  Reviews you've written for products
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground mb-4">Purchase products to leave reviews!</p>
                    <Link to="/women">
                      <Button>Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <Card key={review.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <img
                              src={review.product_image}
                              alt={review.product_name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-medium">{review.product_name}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="card-fashion">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            defaultValue={profile?.first_name || ''}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            defaultValue={profile?.last_name || ''}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          defaultValue=""
                          disabled={loading}
                        />
                        <p className="text-xs text-muted-foreground">
                          Note: Phone and address are stored locally for demo purposes
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          name="address"
                          placeholder="Enter your address"
                          defaultValue=""
                          disabled={loading}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Updating...' : 'Save Changes'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>First Name</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {profile?.first_name || 'Not set'}
                          </p>
                        </div>
                        <div>
                          <Label>Last Name</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {profile?.last_name || 'Not set'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Not set (demo feature)
                        </p>
                      </div>
                      <div>
                        <Label className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Address
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Not set (demo feature)
                        </p>
                      </div>
                      <Button onClick={() => setIsEditing(true)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card className="card-fashion">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Email Notifications</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Order updates</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">New arrivals</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Promotional offers</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Newsletter</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Shopping Preferences</h4>
                    <div className="space-y-3">
                      <div>
                        <Label>Preferred Size</Label>
                        <select className="w-full mt-1 p-2 border rounded">
                          <option>Select size</option>
                          <option>XS</option>
                          <option>S</option>
                          <option>M</option>
                          <option>L</option>
                          <option>XL</option>
                          <option>XXL</option>
                        </select>
                      </div>
                      <div>
                        <Label>Currency</Label>
                        <select className="w-full mt-1 p-2 border rounded">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>GBP (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Save Preferences</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Account Details */}
              <Card className="card-fashion">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Email
                    </Button>
                  </div>
                  
                  <div>
                    <Label>Password</Label>
                    <p className="text-sm text-muted-foreground mt-1">••••••••</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Password
                    </Button>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <Label>Account Status</Label>
                    <div className="mt-1">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Privacy */}
              <Card className="card-fashion">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Privacy Settings</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Profile visible to other users</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Allow data for personalization</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Data Management</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Download My Data
                      </Button>
                      <Button variant="outline" size="sm" className="w-full text-red-600 hover:text-red-700">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Help & Support */}
            <Card className="card-fashion">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Help & Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Help Center
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Privacy Policy
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sign Out */}
            <Card className="card-fashion border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-red-600">Sign Out</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}