import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { Heart, Trash } from "lucide-react";
import { useCart } from "../CartContext";
import { QueryClient } from "react-query";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";

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

function Cart() {
  const { user } = useAuth();
  // const {user} = useAuth();
  const { removeFromCart, increaseCartItem, decreaseCartItem } = useCart();

  const queryClient = useQueryClient();
  // Use React Query to fetch cart data
  const {
    data: cartData,
    error: cartError,
    isLoading: cartLoading,
  } = useQuery("cart", () => getCart(user.token));

  // Use React Query to fetch price data
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
  const handleRemove = async (cartItemId) => {
    // console.log(user);
    try {
      await removeFromCart(cartItemId, user);
      queryClient.invalidateQueries("cart");
      queryClient.invalidateQueries("price");
      console.log("item removed");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleIncreaseCartItem = async (cartItemId) => {
    try {
      await increaseCartItem(cartItemId, user);
      queryClient.invalidateQueries("cart");
      queryClient.invalidateQueries("price");
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const handleDecreaseCartItem = async (cartItemId) => {
    try {
      await decreaseCartItem(cartItemId, user);
      queryClient.invalidateQueries("cart");
      queryClient.invalidateQueries("price");
    } catch (error) {
      console.log("error : ", error);
    }
  };

  // Render data when both requests are successful
  return (
    <>
      <Navbar />
      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 lg:px-0 ">
          <div className="mx-20 max-w-2xl py-8 lg:max-w-7xl">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Cart Items!!
            </h1>
            <div className="mt-8 grid grid-cols-12 gap-4">
              <section
                aria-labelledby="cart-heading"
                className="rounded-lg bg-white col-span-8"
              >
                <h2 id="cart-heading" className="sr-only">
                  Items in your shopping cart !!
                </h2>
                <ul role="list" className="divide-y divide-gray-200 p-5">
                  {console.log(cartData)}
                  {cartData.map((product) => (
                    <li key={product.cartId} className="flex py-6">
                      <div className="flex-shrink-0">
                        <img
                          src={product.product.productImage}
                          alt={product.product.productName}
                          className="h-24 w-24 rounded-md object-contain object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-base sm:text-lg font-semibold text-black">
                                <a href={product.href}>
                                  {product.product.productName}
                                </a>
                              </h3>
                            </div>
                            <div className="mt-1 flex text-sm">
                              {product.productCount ? (
                                <p className="ml-4 border-l border-gray-200 pl-4 text-sm text-gray-500">
                                  Quantity: {product.productCount}
                                </p>
                              ) : null}
                            </div>
                            <div className="mt-1 flex items-end">
                              <p className="text-sm font-medium text-gray-500">
                                Total Price: ₹
                                {product.product.productPrice *
                                  product.productCount}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mb-2 mt-4 flex items-center">
                          <button
                            type="button"
                            className="h-7 w-7 bg-gray-200 rounded-full text-gray-600"
                            onClick={() =>
                              handleDecreaseCartItem(product.cartId)
                            }
                          >
                            -
                          </button>
                          {/* <input
                          type="text"
                          className="mx-2 h-7 w-10 rounded-md border text-center"
                          defaultValue={product.productCount}
                        /> */}
                          <span className="mx-2 h-7 w-10 rounded-md border text-center">
                            {product.productCount}
                          </span>
                          <button
                            type="button"
                            className="h-7 w-7 bg-gray-200 rounded-full text-gray-600"
                            onClick={() =>
                              handleIncreaseCartItem(product.cartId)
                            }
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="ml-4 text-red-500"
                            onClick={() => handleRemove(product.cartId)}
                          >
                            <Trash size={16} />
                            <span className="text-xs font-medium">Remove</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
              <section
                aria-labelledby="summary-heading"
                className="mt-8 rounded-md bg-white col-span-4"
              >
                <h2
                  id="summary-heading"
                  className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4"
                >
                  Price Details
                </h2>
                <div className="px-4 py-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-800">
                      Price ({cartData.length})
                    </span>
                    <span className="font-medium text-gray-900">
                      {priceData.totalCartPrice}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-800">Discount</span>
                    <span className="font-medium text-green-700">5%</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-800">Delivery Charges</span>
                    <span className="font-medium text-green-700">Free</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="text-base font-medium text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-base font-medium text-gray-900">
                      {priceData.totalCartPrice - 0.05*priceData.totalCartPrice}
                    </span>
                  </div>
                  <div className="py-2 font-medium text-green-700">
                    You will save ₹ {0.05*priceData.totalCartPrice} on this order
                  </div>
                  <Link
                    to={{
                      pathname: "/checkout",
                    }}
                  >
                    <button
                      type="button"
                      className="mt-4 rounded-md bg-black px-5 py-3 text-[15px]  text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      Checkout
                    </button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Cart;
