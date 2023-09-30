import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);
import axios from "axios";
export const CartProvider = ({ children }) => {
  const addToCart = async (productId, productCount, authToken) => {
    console.log(authToken);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.token}`,
    };
    console.log(headers);
    const data = {
      productId,
      productCount,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/add-to-cart",
        data,
        { headers }
      );

      if (response.status === 200) {
        // Successfully added to cart
        // Optionally, you can handle the response data here if needed.
        console.log(response);
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };
  return (
    <CartContext.Provider value={{ addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
