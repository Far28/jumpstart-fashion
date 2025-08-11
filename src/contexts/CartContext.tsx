import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size?: string;
  color?: string;
  product?: {
    id: string;
    name: string;
    price: number;
    sale_price?: number;
    image_url?: string;
    is_sale: boolean;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart items when user logs in
  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  // Function to load cart items from both database and localStorage
  const isSampleProduct = (productId: string) => {
    return /^550e8400-e29b-41d4-a716-446655440\d{3}$/.test(productId);
  };

  // Helper function to manage sample products in localStorage
  const addSampleProductToCart = (productId: string, quantity = 1, size?: string, color?: string) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }

    const storageKey = `sample_cart_${user.id}`;
    const existingCart = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Find existing item with same product, size, and color
    const existingItemIndex = existingCart.findIndex((item: any) => 
      item.product_id === productId && 
      item.size === size && 
      item.color === color
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem = {
        id: `sample_${Date.now()}_${Math.random()}`,
        product_id: productId,
        user_id: user.id,
        quantity: quantity,
        size: size || null,
        color: color || null,
        created_at: new Date().toISOString(),
      };
      existingCart.push(newItem);
    }

    localStorage.setItem(storageKey, JSON.stringify(existingCart));
    
    // Update the cart items state to include sample products
    loadCartItems();
    
    toast({
      title: 'Added to cart',
      description: 'Item has been added to your cart.',
    });
  };

  // Function to load cart items from both database and localStorage
  const loadCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load database cart items
      const { data: dbItems, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            id,
            name,
            price,
            sale_price,
            image_url,
            is_sale
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Load sample cart items from localStorage
      const storageKey = `sample_cart_${user.id}`;
      const sampleItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Add sample product data to sample items
      const sampleItemsWithProducts = sampleItems.map((item: any) => ({
        ...item,
        product: getSampleProductData(item.product_id)
      }));

      // Combine database and sample items
      const allItems = [...(dbItems || []), ...sampleItemsWithProducts];
      setItems(allItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast({
        title: 'Error loading cart',
        description: 'Failed to load your cart items.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get sample product data
  const getSampleProductData = (productId: string) => {
    // Sample product data - this should match the data from your product pages
    const sampleProducts: { [key: string]: any } = {
      // Women's Products
      '550e8400-e29b-41d4-a716-446655440001': {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Elegant Evening Dress',
        price: 129.99,
        sale_price: null,
        image_url: '/images/dress.png',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440002': {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Luxury Designer Clutch',
        price: 89.99,
        sale_price: null,
        image_url: '/images/image.png',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440003': {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Bohemian Maxi Dress',
        price: 79.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440004': {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Classic Trench Coat',
        price: 199.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440005': {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Silk Blouse',
        price: 69.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440006': {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: 'High-Waisted Jeans',
        price: 89.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440007': {
        id: '550e8400-e29b-41d4-a716-446655440007',
        name: 'Vintage Leather Jacket',
        price: 249.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440008': {
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Floral Print Skirt',
        price: 59.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440009': {
        id: '550e8400-e29b-41d4-a716-446655440009',
        name: 'Cashmere Sweater',
        price: 159.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440010': {
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: 'Designer Handbag',
        price: 299.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440011': {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: 'Cocktail Dress',
        price: 149.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440012': {
        id: '550e8400-e29b-41d4-a716-446655440012',
        name: 'Statement Earrings',
        price: 39.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440013': {
        id: '550e8400-e29b-41d4-a716-446655440013',
        name: 'Wrap Blouse',
        price: 79.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440014': {
        id: '550e8400-e29b-41d4-a716-446655440014',
        name: 'Pencil Skirt',
        price: 69.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440015': {
        id: '550e8400-e29b-41d4-a716-446655440015',
        name: 'Blazer',
        price: 119.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440016': {
        id: '550e8400-e29b-41d4-a716-446655440016',
        name: 'Designer Scarf',
        price: 49.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      
      // Men's Products (101-112)
      '550e8400-e29b-41d4-a716-446655440101': {
        id: '550e8400-e29b-41d4-a716-446655440101',
        name: 'Classic Suit',
        price: 399.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440102': {
        id: '550e8400-e29b-41d4-a716-446655440102',
        name: 'Leather Dress Shoes',
        price: 199.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440103': {
        id: '550e8400-e29b-41d4-a716-446655440103',
        name: 'Cotton Polo Shirt',
        price: 59.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440104': {
        id: '550e8400-e29b-41d4-a716-446655440104',
        name: 'Denim Jeans',
        price: 89.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440105': {
        id: '550e8400-e29b-41d4-a716-446655440105',
        name: 'Wool Sweater',
        price: 129.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440106': {
        id: '550e8400-e29b-41d4-a716-446655440106',
        name: 'Casual Sneakers',
        price: 149.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440107': {
        id: '550e8400-e29b-41d4-a716-446655440107',
        name: 'Business Shirt',
        price: 79.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440108': {
        id: '550e8400-e29b-41d4-a716-446655440108',
        name: 'Leather Belt',
        price: 49.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440109': {
        id: '550e8400-e29b-41d4-a716-446655440109',
        name: 'Chino Pants',
        price: 69.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440110': {
        id: '550e8400-e29b-41d4-a716-446655440110',
        name: 'Hoodie',
        price: 89.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440111': {
        id: '550e8400-e29b-41d4-a716-446655440111',
        name: 'Sports Watch',
        price: 299.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440112': {
        id: '550e8400-e29b-41d4-a716-446655440112',
        name: 'Winter Jacket',
        price: 179.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      
      // Accessories (201-212)
      '550e8400-e29b-41d4-a716-446655440201': {
        id: '550e8400-e29b-41d4-a716-446655440201',
        name: 'Designer Sunglasses',
        price: 159.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440202': {
        id: '550e8400-e29b-41d4-a716-446655440202',
        name: 'Silk Scarf',
        price: 69.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440203': {
        id: '550e8400-e29b-41d4-a716-446655440203',
        name: 'Gold Watch',
        price: 899.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440204': {
        id: '550e8400-e29b-41d4-a716-446655440204',
        name: 'Pearl Necklace',
        price: 299.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440205': {
        id: '550e8400-e29b-41d4-a716-446655440205',
        name: 'Leather Wallet',
        price: 89.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440206': {
        id: '550e8400-e29b-41d4-a716-446655440206',
        name: 'Diamond Earrings',
        price: 599.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440207': {
        id: '550e8400-e29b-41d4-a716-446655440207',
        name: 'Luxury Handbag',
        price: 499.99,
        sale_price: null,
        image_url: '/images/image.png',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440208': {
        id: '550e8400-e29b-41d4-a716-446655440208',
        name: 'Designer Belt',
        price: 129.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440209': {
        id: '550e8400-e29b-41d4-a716-446655440209',
        name: 'Silver Bracelet',
        price: 149.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440210': {
        id: '550e8400-e29b-41d4-a716-446655440210',
        name: 'Fashion Ring',
        price: 79.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440211': {
        id: '550e8400-e29b-41d4-a716-446655440211',
        name: 'Cashmere Gloves',
        price: 59.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440212': {
        id: '550e8400-e29b-41d4-a716-446655440212',
        name: 'Vintage Brooch',
        price: 39.99,
        sale_price: null,
        image_url: '/placeholder.svg',
        is_sale: false
      },
      
      // Sale Products (301-303)
      '550e8400-e29b-41d4-a716-446655440301': {
        id: '550e8400-e29b-41d4-a716-446655440301',
        name: 'Summer Dress',
        price: 99.99,
        sale_price: 59.99,
        image_url: '/placeholder.svg',
        is_sale: true
      },
      '550e8400-e29b-41d4-a716-446655440302': {
        id: '550e8400-e29b-41d4-a716-446655440302',
        name: 'Designer Handbag',
        price: 299.99,
        sale_price: 199.99,
        image_url: '/placeholder.svg',
        is_sale: true
      },
      '550e8400-e29b-41d4-a716-446655440303': {
        id: '550e8400-e29b-41d4-a716-446655440303',
        name: 'Casual Sneakers',
        price: 149.99,
        sale_price: 99.99,
        image_url: '/placeholder.svg',
        is_sale: true
      }
    };

    return sampleProducts[productId] || {
      id: productId,
      name: 'Sample Product',
      price: 49.99,
      sale_price: null,
      image_url: '/placeholder.svg',
      is_sale: false
    };
  };

  const addToCart = async (productId: string, quantity = 1, size?: string, color?: string) => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if this is a sample product (starts with our UUID pattern)
      const isSampleProduct = productId.startsWith('550e8400-e29b-41d4-a716-');
      
      if (isSampleProduct) {
        // Handle sample products with localStorage
        await addSampleProductToCart(productId, quantity, size, color);
        return;
      }

      // Check if item already exists in cart
      const existingItem = items.find(
        item => item.product_id === productId && 
                item.size === size && 
                item.color === color
      );

      if (existingItem) {
        // Update quantity
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            size,
            color,
          })
          .select(`
            *,
            product:products (
              id,
              name,
              price,
              sale_price,
              image_url,
              is_sale
            )
          `)
          .single();

        if (error) throw error;
        
        setItems(prev => [...prev, data]);
        toast({
          title: 'Added to cart',
          description: 'Item has been added to your cart.',
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error adding to cart',
        description: 'Failed to add item to your cart.',
        variant: 'destructive',
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    try {
      // Check if this is a sample product
      if (itemId.startsWith('sample_')) {
        // Handle sample products with localStorage
        if (!user) return;
        
        const storageKey = `sample_cart_${user.id}`;
        const sampleCart = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updatedCart = sampleCart.map((item: any) => 
          item.id === itemId ? { ...item, quantity } : item
        );
        
        localStorage.setItem(storageKey, JSON.stringify(updatedCart));
        loadCartItems();
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error updating quantity',
        description: 'Failed to update item quantity.',
        variant: 'destructive',
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      // Check if this is a sample product
      if (itemId.startsWith('sample_')) {
        // Handle sample products with localStorage
        if (!user) return;
        
        const storageKey = `sample_cart_${user.id}`;
        const sampleCart = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updatedCart = sampleCart.filter((item: any) => item.id !== itemId);
        
        localStorage.setItem(storageKey, JSON.stringify(updatedCart));
        loadCartItems();
        
        toast({
          title: 'Removed from cart',
          description: 'Item has been removed from your cart.',
        });
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: 'Removed from cart',
        description: 'Item has been removed from your cart.',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error removing item',
        description: 'Failed to remove item from cart.',
        variant: 'destructive',
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      // Clear database cart items
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      // Clear sample cart items from localStorage
      const storageKey = `sample_cart_${user.id}`;
      localStorage.removeItem(storageKey);

      setItems([]);
      toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart.',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error clearing cart',
        description: 'Failed to clear your cart.',
        variant: 'destructive',
      });
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.product?.is_sale && item.product?.sale_price 
        ? item.product.sale_price 
        : item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const value = {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};