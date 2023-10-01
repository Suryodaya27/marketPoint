import { Heart, Trash } from 'lucide-react';
import React from 'react';
import { useAuth } from "../AuthContext";
import { useCart } from "../CartContext";

export function CartTwo({ cartData,priceData }) {

  const {user} = useAuth();
  const {removeFromCart} = useCart();

  const handleRemove = async (cartItemId)=>{
    console.log(user)
    try {
      await removeFromCart(cartItemId,user);
      console.log("item removed");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  }
  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-0">
      <div className="mx-20 max-w-2xl py-8 lg:max-w-7xl">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Cart Items
        </h1>
        <div className="mt-8 grid grid-cols-12 gap-4">
          <section
            aria-labelledby="cart-heading"
            className="rounded-lg bg-white col-span-8"
          >
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <ul role="list" className="divide-y divide-gray-200">
              {cartData.map((product) => (
                <li key={product.cartId} className="flex py-6">
                  <div className="flex-shrink-0">
                    <img
                      src={product.imageSrc}
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
                            Total Price: ₹{product.product.productPrice * product.productCount}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2 mt-4 flex items-center">
                      <button type="button" className="h-7 w-7 bg-gray-200 rounded-full text-gray-600">
                        -
                      </button>
                      <input
                        type="text"
                        className="mx-2 h-7 w-10 rounded-md border text-center"
                        defaultValue={product.productCount}
                      />
                      <button type="button" className="h-7 w-7 bg-gray-200 rounded-full text-gray-600">
                        +
                      </button>
                      <button type="button" className="ml-4 text-red-500"
                      onClick={() => handleRemove(product.cartId)}>
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
                <span className="text-gray-800">Price ({cartData.length})</span>
                <span className="font-medium text-gray-900">{priceData.totalCartPrice}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-800">Discount</span>
                <span className="font-medium text-green-700">0</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-800">Delivery Charges</span>
                <span className="font-medium text-green-700">Free</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200">
                <span className="text-base font-medium text-gray-900">Total Amount</span>
                <span className="text-base font-medium text-gray-900">{priceData.totalCartPrice}</span>
              </div>
              <div className="py-2 font-medium text-green-700">
              You will save ₹0 on this order
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
