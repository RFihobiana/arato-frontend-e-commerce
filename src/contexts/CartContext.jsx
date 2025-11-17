import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const STORAGE_KEY = "cartData";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) =>
        ci.numProduit && item.numProduit
          ? ci.numProduit === item.numProduit
          : ci.nom === item.nom
      );

      if (existingIndex !== -1) {
        const next = [...prev];
        next[existingIndex].quantityKg =
          (Number(next[existingIndex].quantityKg) || 0) +
          (Number(item.quantityKg) || 1);
        return next;
      }

      const generatedId = `${Date.now()}-${Math.random()}`;

      return [
        ...prev,
        {
          ...item,
          id: generatedId
        }
      ];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity, newCuttingOption) => {
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          return {
            ...i,
            quantityKg: Number(newQuantity),
            cuttingOption:
              newCuttingOption !== undefined
                ? newCuttingOption
                : i.cuttingOption
          };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalWeight = cartItems.reduce(
    (sum, item) => sum + Number(item.quantityKg || 0),
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.prixPerKg || item.prix || 0) *
        Number(item.quantityKg || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalWeight,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};