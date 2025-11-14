
import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (produit) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === produit.id);
      if (existing) {
        return prevItems.map(item => 
          item.id === produit.id
          ? { ...item, quantityKg: item.quantityKg + 1 }
          : item
        );
      } else {
        return [...prevItems, { ...produit, quantityKg: 1, cuttingOption: "entier" }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, quantityKg: quantity } : item
    ));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
