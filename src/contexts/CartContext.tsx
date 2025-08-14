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
    // Sample product data - this matches the data from ProductDetail.tsx
    const sampleProducts: { [key: string]: any } = {
      // Women's Products
      '550e8400-e29b-41d4-a716-446655440001': {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Aurora Velvet Evening Gown',
        price: 445,
        sale_price: 356,
        image_url: 'auroravelvetgown.jpg',
        is_sale: true
      },
      '550e8400-e29b-41d4-a716-446655440002': {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Meadow Chiffon Midi Dress',
        price: 195,
        sale_price: null,
        image_url: 'meadow-chiffon-midi-dress.png',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440003': {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Midnight Satin Slip Dress',
        price: 229,
        sale_price: null,
        image_url: 'midnight-satin-slip-dress.jpg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440004': {
        id: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Alpaca Wool Turtleneck',
        price: 298,
        sale_price: null,
        image_url: 'alapacacool.jpg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440005': {
        id: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Embroidered Peasant Blouse',
        price: 165,
        sale_price: null,
        image_url: 'embroidered-peasant-blouse.jpg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440006': {
        id: '550e8400-e29b-41d4-a716-446655440006',
        name: 'Organic Cotton Henley',
        price: 98,
        sale_price: null,
        image_url: 'organic-cotton-henley.jpg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440007': {
        id: '550e8400-e29b-41d4-a716-446655440007',
        name: 'Pleated Palazzo Pants',
        price: 189,
        sale_price: null,
        image_url: 'pleated-plazo-pants.png',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440008': {
        id: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Raw Hem Boyfriend Jeans',
        price: 125,
        sale_price: null,
        image_url: 'raw-hem-boyfriend-jeans.png',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440009': {
        id: '550e8400-e29b-41d4-a716-446655440009',
        name: 'Double-Breasted Trench Coat',
        price: 389,
        sale_price: null,
        image_url: 'doublebreastedtrenchcoat.jpg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440010': {
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: 'Faux Fur Cropped Jacket',
        price: 275,
        sale_price: 206,
        image_url: 'fauxfurjacket.jpg',
        is_sale: true
      },
      '550e8400-e29b-41d4-a716-446655440011': {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: 'Pointed Toe Stiletto Pumps',
        price: 245,
        sale_price: null,
        image_url: 'pointed-toe-stiletto-pumps.jpg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440012': {
        id: '550e8400-e29b-41d4-a716-446655440012',
        name: 'Platform Espadrille Sandals',
        price: 155,
        sale_price: null,
        image_url: 'platform-espadrille-sandals.jpg',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440013': {
        id: '550e8400-e29b-41d4-a716-446655440013',
        name: 'Quilted Chain Shoulder Bag',
        price: 325,
        sale_price: null,
        image_url: 'image.png',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440014': {
        id: '550e8400-e29b-41d4-a716-446655440014',
        name: 'Woven Straw Bucket Bag',
        price: 98,
        sale_price: 78,
        image_url: 'woven-straw-bucket-bag.jpg',
        is_sale: true
      },
      '550e8400-e29b-41d4-a716-446655440015': {
        id: '550e8400-e29b-41d4-a716-446655440015',
        name: 'Vintage-Inspired Cuff Bracelet',
        price: 125,
        sale_price: null,
        image_url: 'vintage-inspired-cuff-bracelet.png',
        is_sale: false
      },
      '550e8400-e29b-41d4-a716-446655440016': {
        id: '550e8400-e29b-41d4-a716-446655440016',
        name: 'Diamond-Cut Hoop Earrings',
        price: 89,
        sale_price: null,
        image_url: 'diamondcuthoop.jpg',
        is_sale: false
      }
    };

    return sampleProducts[productId] || {
      id: productId,
      name: 'Sample Product',
      price: 49.99,
      sale_price: null,
      image_url: 'placeholder.svg',
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