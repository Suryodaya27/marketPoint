import React, { useState } from "react";
import { useQuery } from "react-query";
import ProductCard from "../components/ProductCard";
import { Navbar } from "../components/Navbar";
import axios from "axios";

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
  const [categoryFilter, setCategoryFilter] = useState("all"); // Initial filter: show all products

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

  return (
    <>
      <Navbar />
      <div className=" mx-12 py-3">
        {/* Category filtering UI */}
        <div className="mb-4">
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

        {/* Display filtered products */}
        <div className="flex flex-wrap justify-start gap-4">
          {filteredData.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductList;
