import React, { useState } from "react";
import { useQuery } from "react-query";
import ProductCard from "../components/ProductCard";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { Footer } from "../components/Footer";

async function fetchProducts() {
  try {
    const response = await axios.get("http://localhost:8080/api/get-products");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch groceries: " + error.message);
  }
}

function ProductList() {
  const { data, error, isLoading } = useQuery("products", fetchProducts);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
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

  return (
    <>
      <Navbar />
      <div className="mx-12 py-3">
        <div className="flex justify-between mb-4">
          {/* Category filtering UI */}
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

          {/* Search input */}
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

        {/* Display filtered products */}
        <div className="flex flex-wrap justify-start gap-4">
          {searchedData.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default ProductList;
