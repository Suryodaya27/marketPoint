import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);
import axios from "axios";
export const CartProvider = ({ children }) => {
  const addToCart = async (productId, productCount, authToken) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken.token}`,
    };
    // console.log(headers);
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

  const removeFromCart = async (cartItemId, authToken) => {
    // console.log(authToken);
    // console.log(cartItemId);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken.token}`,
    };
    const data = {
      cartItemId,
    };
    try {
      const response = await axios.delete(
        'http://localhost:8080/api/remove-from-cart',
        { data, headers } // Pass data as the second argument
      );
  
      if (response.status === 200) {
        // Successfully deleted from cart
        // Optionally, you can update the cartData state here
        console.log(response);
      } else {
        throw new Error('Failed to delete from cart');
      }
    } catch (error) {
      console.error('Error deleting from cart:', error);
      throw error;
    }
  };

  const increaseCartItem = async (cartItemId, authToken) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken.token}`,
    };
    const data = {
      cartItemId,
    };
    try {
      const response = await axios.put(
        'http://localhost:8080/api/increase-cart-item',
        data,
        {headers } // Pass data as the second argument
      );
  
      if (response.status === 200) {
        console.log(response);
      } else {
        throw new Error('Failed to delete from cart');
      }
    } catch (error) {
      console.error('Error deleting from cart:', error);
      throw error;
    }
  };

  const decreaseCartItem = async (cartItemId, authToken) => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken.token}`,
    };
    console.log(authToken)
    const data = {
      cartItemId,
    };
    try {
      const response = await axios.put(
        'http://localhost:8080/api/decrease-cart-item',
        data,  // Pass data directly
        { headers } // Pass headers separately
      );
  
      if (response.status === 200) {
        console.log(response);
      } else {
        throw new Error('Failed to decrease item quantity in the cart');
      }
    } catch (error) {
      console.error('Error decreasing item quantity in the cart:', error);
      throw error;
    }
  };


  return (
    <CartContext.Provider value={{ addToCart ,removeFromCart, increaseCartItem ,decreaseCartItem}}>
      {children}
    </CartContext.Provider>
  );
};
