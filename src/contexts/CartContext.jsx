import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const STORAGE_KEY = "cartData";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Erreur lecture localStorage cart:", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Erreur écriture localStorage cart:", e);
    }
  }, [cartItems]);

    const addToCart = (item) => {
    setCartItems(prev => {
         const existingIndex = prev.findIndex(ci => ci.numProduit && item.numProduit ? ci.numProduit === item.numProduit : ci.nom === item.nom);
      if (existingIndex !== -1) {
        const next = [...prev];
        next[existingIndex].quantityKg = (Number(next[existingIndex].quantityKg) || 0) + (Number(item.quantityKg) || 1);
        return next;
      }
       const id = item.numProduit ? `${item.numProduit}-${Date.now()}` : `${item.nom}-${Date.now()}`;
      return [...prev, { id, ...item }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prev => prev.map(i => i.id === itemId ? { ...i, quantityKg: newQuantity } : i));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
