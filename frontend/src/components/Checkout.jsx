import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAuth } from "../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import axios from "axios";

// Function to fetch cart data
async function getCart(authToken) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  try {
    const response = await axios.get("http://localhost:8080/api/get-cart", {
      headers: headers,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching cart data");
  }
}

// Function to fetch price data
async function getPrice(authToken) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  try {
    const response = await axios.get("http://localhost:8080/api/get-price", {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching price data");
  }
}

export function Checkout() {
  const { user } = useAuth();
  const {
    data: cartData,
    error: cartError,
    isLoading: cartLoading,
  } = useQuery("cart", () => getCart(user.token));

  const {
    data: priceData,
    error: priceError,
    isLoading: priceLoading,
  } = useQuery("price", () => getPrice(user.token));

  // Loading and Error components
  if (cartLoading || priceLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center text-xl mt-8"
      >
        Loading...
      </motion.div>
    );
  }

  if (cartError || priceError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center text-xl mt-8"
      >
        Error: {cartError ? cartError.message : priceError.message}
      </motion.div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 py-8 ">
        <div className="mx-auto max-w-4xl px-4 ">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cart Items
            </h2>
            <AnimatePresence>
              {cartData.map((item) => (
                <motion.div
                  key={item.cartId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 border-b border-gray-300 pb-4"
                >
                  <p className="text-gray-700">{item.product.productName}</p>
                  <p className="text-gray-500">Quantity: {item.productCount}</p>
                  <p className="text-gray-700">
                    Total Price: ₹{item.productCount * item.product.productPrice}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            <p className="text-2xl mt-4">
              Total Cart Price: ₹{priceData.totalCartPrice}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
