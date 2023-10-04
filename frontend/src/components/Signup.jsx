import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useMutation } from "react-query";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Modify the signupUser function to include name, address, and phoneNumber
async function signupUser({ name, email, password, address, phoneNumber }) {
  try {
    const response = await axios.post("http://localhost:8080/api/signup", {
      name,
      email,
      password,
      address,
      phoneNumber,
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Signup failed");
    }
  } catch (error) {
    throw new Error("Signup failed: " + error.message);
  }
}

export function Signup() {
  const navigate = useNavigate();
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
  });

  const signupMutation = useMutation(signupUser, {
    onSuccess: () => {
      setIsSuccessAlertVisible(true);
      setErrorText("");
      setTimeout(() => {
        setIsSuccessAlertVisible(false);
        navigate("/signin");
      }, 3000);
    },
    onError: (error) => {
      setErrorText(error.message);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signupMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        {isSuccessAlertVisible && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md mb-4">
            Signup successful! Redirecting to login...
          </div>
        )}

        {errorText && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4">
            {errorText}
          </div>
        )}

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <div className="mb-2 flex justify-center">
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
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight text-black">
              Sign up to create an account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Sign In here
              </Link>
            </p>
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="text-base font-medium text-gray-900"
                  >
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-base font-medium text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="text-base font-medium text-gray-900"
                  >
                    Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="text-base font-medium text-gray-900"
                  >
                    Phone Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      required
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    disabled={signupMutation.isLoading}
                    className={`inline-flex w-full items-center justify-center rounded-md px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 ${
                      signupMutation.isLoading
                        ? "bg-gray-400 cursor-not-allowed opacity-70"
                        : "bg-black"
                    }`}
                  >
                    {signupMutation.isLoading
                      ? "Signing Up..."
                      : "Create Account"}
                    <ArrowRight className="ml-2" size={16} />
                  </motion.button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
