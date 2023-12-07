import { useQuery } from "react-query";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";

async function fetchProducts() {
  try {
    const response = await axios.get("http://localhost:8080/api/get-products");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch groceries: " + error.message);
  }
}

export const Product = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { data, error, isLoading } = useQuery("products", fetchProducts);
  const [countQuantity, setCountQuantity] = useState(1);
  if (isLoading) {
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

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center text-xl mt-8"
      >
        Error: {error.message}
      </motion.div>
    );
  }

  const { productId } = useParams();
  const product = data.find((p) => p.productId === parseInt(productId));
  console.log(product);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  console.log(user)
  const handleCart = async () => {
    const id = parseInt(productId);
    const count = parseInt(countQuantity);
    try {
      await addToCart(id, count, user);
      setIsAddedToCart(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-5xl px-5 py-24">
        <div className="mx-auto flex flex-wrap items-center lg:w-4/5">
          <img
            alt={product.productName}
            className="h-[250px] w-[250px] rounded object-contain"
            src={product.productImage}
          />
          <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:pl-10">
            <h2 className="text-sm font-semibold tracking-widest text-gray-500">
              {product.productCategory}
            </h2>
            <h1 className="my-4 text-3xl font-semibold text-black">
              {product.productName}
            </h1>
            <div className="my-4 flex items-center"></div>
            <p className="leading-relaxed">{product.productDescription}</p>
            <div className="mb-5 mt-6 flex items-center border-b-2 border-gray-100 pb-5">
              <div className=" flex items-center">
                <span className="mr-3 text-sm font-semibold">Quantity</span>
                <div className="relative">
                  <select
                    className="appearance-none rounded border border-gray-300 py-2 px-5 text-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black"
                    onChange={(e) => setCountQuantity(e.target.value)}
                    value={countQuantity}
                  >
                    <option value="1">1 unit</option>
                    <option value="2">2 units</option>
                    <option value="3">3 units</option>
                    <option value="4">4 units</option>
                    <option value="5">5 units</option>
                    <option value="6">6 units</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="title-font text-xl font-bold text-gray-900">
                ₹{product.productPrice}
              </span>
              <p>x {countQuantity}</p>
              <button
                type="button"
                className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                onClick={handleCart}
                disabled={!user}
              >
                Add to Cart
              </button>
              
              {isAddedToCart && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center z-50"
                  style={{ background: "rgba(0, 0, 0, 0.5)" }}
                >
                  <div className="bg-white rounded p-4">
                    <p className="text-lg font-semibold mb-2">
                      Successfully added to cart!
                    </p>
                    <button
                      className="bg-black text-white px-3 py-1 rounded hover:bg-black/80"
                      onClick={() => setIsAddedToCart(false)}
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            
          </div>
          {!user && <h2>Please login to add this item to cart</h2>}
        </div>
      </div>
    </section>
  );
};
