// ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
function ProductCard({ product }) {
  console.log(product)
  return (
    <div className="w-[300px] rounded-md border bg-white">
      <img src={product.productImage} alt={product.productName} className="m-auto h-[150px] w-[150px] rounded-md object-contain" />
      <div className="p-4">
        <h1 className="text-lg font-semibold">{product.productName}</h1>
        <p className="mt-3 text-sm text-gray-600">{product.productDescription}</p>
        <button type="button" className="mt-4 rounded-sm bg-black px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
          <Link to = {`/product/${product.productId}`}>
            View More
          </Link>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
