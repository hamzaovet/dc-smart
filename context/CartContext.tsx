"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  nameAr: string;
  nameEn: string;
  brandAr: string;
  brandEn: string;
  type: string;
  volume: string;
  concentration: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("rovy_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("rovy_cart", JSON.stringify(newItems));
  };

  const addToCart = (product: any, quantity = 1) => {
    const existing = items.find((i) => i.id === product.id);
    if (existing) {
      const updated = items.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
      );
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        id: product.id,
        nameAr: product.nameAr,
        nameEn: product.nameEn,
        brandAr: product.brandAr,
        brandEn: product.brandEn,
        type: product.type,
        volume: product.volume,
        concentration: product.concentration,
        price: product.price,
        image: product.image,
        quantity,
      };
      saveCart([...items, newItem]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    saveCart(updated);
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = items
      .map((i) => {
        if (i.id === id) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      })
      .filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 1500 || subtotal === 0 ? 0 : 50;
  const total = subtotal + deliveryFee;
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        totalCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
