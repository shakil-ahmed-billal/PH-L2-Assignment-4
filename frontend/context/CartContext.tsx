"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

/** Minimal meal shape for cart (supports both API and mock Meal types) */
export interface CartMeal {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  providerId?: string;
  description?: string | null;
  originalPrice?: number;
  slug?: string;
  categoryId?: string;
  category?: string;
  providerName?: string;
  provider?: { name: string };
  rating?: number;
  reviewCount?: number;
  prepTime?: string | null;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  ingredients?: string[];
}

export interface CartItem {
  meal: CartMeal;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (meal: CartMeal, quantity?: number) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((meal: CartMeal, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.meal.id === meal.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.meal.id === meal.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { meal, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((mealId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.meal.id !== mealId));
  }, []);

  const updateQuantity = useCallback((mealId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(mealId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.meal.id === mealId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getSubtotal = useCallback(() => {
    return items.reduce((total, item) => total + item.meal.price * item.quantity, 0);
  }, [items]);

  const getDeliveryFee = useCallback(() => {
    if (items.length === 0) return 0;
    return 2.99; // Fixed delivery fee
  }, [items]);

  const getTotal = useCallback(() => {
    return getSubtotal() + getDeliveryFee();
  }, [getSubtotal, getDeliveryFee]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getDeliveryFee,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
