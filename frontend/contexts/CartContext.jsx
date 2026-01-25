"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCartToken, setCartToken } from "../lib/cart";
import { apiUrl } from "../lib/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const token = getCartToken();
      const response = await fetch(apiUrl("/api/cart/"), {
        headers: token ? { "X-Cart-Token": token } : undefined,
      });
      const data = await response.json();
      if (data?.token) {
        setCartToken(data.token);
      }
      const nextItems = data?.items || [];
      const total = nextItems.reduce((sum, item) => sum + item.quantity, 0);
      setItems(nextItems);
      setCount(total);
    } catch (error) {
      setItems([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCart = useCallback((newCount, newItems) => {
    setCount(newCount);
    setItems(newItems);
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <CartContext.Provider
      value={{
        count,
        items,
        loading,
        loadCart,
        updateCart,
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
