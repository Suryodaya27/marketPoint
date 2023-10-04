import React, { useState } from "react";
import { useQuery } from "react-query";
import ProductCard from "../components/ProductCard";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { Footer } from "../components/Footer";
import { motion } from "framer-motion";

async function fetchProducts() {
  try {
    const response = await axios.get("http://localhost:8080/api/get-products");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch groceries: " + error.message);
  }
}

function ProductList() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading } = useQuery("products", fetchProducts);

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

  // Filter products based on category
  const filteredData =
    categoryFilter === "all"
      ? data
      : data.filter((product) => product.productCategory === categoryFilter);

  // Filter products based on search query
  const searchedData = filteredData.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total number of pages based on the filtered data and page size
  const pageSize = 12; // Number of products per page
  const totalPages = Math.ceil(searchedData.length / pageSize);

  // Calculate the starting index for the current page
  const startIndex = (currentPage - 1) * pageSize;

  // Slice the data to get the products for the current page
  const productsForPage = searchedData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-100">
      <Navbar />
      <div className="mx-12 py-3 ">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="flex justify-between mb-4">
            <div>
              <label htmlFor="categoryFilter" className="mr-2">
                Filter by Category:
              </label>
              <select
                id="categoryFilter"
                onChange={(e) => setCategoryFilter(e.target.value)}
                value={categoryFilter}
                className="px-2 py-1 border rounded-md"
              >
                <option value="all">All</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Dairy">Dairy</option>
                <option value="Grains">Grains</option>
                <option value="Bakery">Bakery</option>
                <option value="Seafood">Seafood</option>
                <option value="Nuts">Nuts</option>
                <option value="Condiments">Condiments</option>
              </select>
            </div>

            <div>
              <label htmlFor="search" className="mr-2">
                Search:
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-2 py-1 border rounded-md"
              />
            </div>
          </div>

          <div className="py-4 flex flex-wrap justify-start gap-4">
            {productsForPage.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <div className="flex items-center">
              
              {[...Array(totalPages)].map((_, page) => (
                <a
                  key={page + 1}
                  href="#"
                  className={`mx-1 flex items-center rounded-md border border-gray-400 px-3 py-1 text-gray-900 hover:scale-105 ${
                    page + 1 === currentPage
                      ? "bg-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </a>
              ))}
              
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
}

export default ProductList;
