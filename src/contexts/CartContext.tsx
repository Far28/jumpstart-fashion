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
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
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
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: 'Error loading cart',
        description: 'Failed to load your cart items.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

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