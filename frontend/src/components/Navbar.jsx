import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const menuItems = [
  {
    name: "Products",
    to: "/", // Replace with your actual route
  },
  {
    name: "Cart",
    to: "/cart", // Replace with your actual route
  },
  {
    name: "Wishlist",
    to: "/wishlist", // Replace with your actual route
  },
];

export function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Use the useAuth hook to access user and logout function

  const handleLogout = () => {
    // Call the logout function from the context
    logout();
    // Navigate to the home page or any other route
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="py-2 relative w-full bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2">
          <span>
            <svg
              className="h-8 w-8 text-black"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="2"></circle>
              <circle cx="20" cy="21" r="2"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 1.9 1.61h10.84a2 2 0 0 0 1.9-1.61L23 6H6"></path>
            </svg>
          </span>
          <span className="font-bold">Apna Mart</span>
        </div>
        <div className="hidden lg:flex">
          <ul className="ml-12 inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className="text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:block">
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/signin"
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Login
            </Link>
          )}
        </div>
        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
            {/* ... (your mobile menu content) */}
          </div>
        )}
      </div>
    </div>
  );
}
