import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useMutation } from "react-query";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

async function signupUser({ email, password }) {
  try {
    const response = await axios.post("http://localhost:8080/api/signup", {
      email,
      password,
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
  const [formData, setFormData] = useState({ email: "", password: "" });

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
        initial={{ opacity: 0, y: 20 }} // Initial animation properties
        animate={{ opacity: 1, y: 0 }} // Animation properties when the page loads
        exit={{ opacity: 0, y: 20 }} // Animation properties when the page exits
        transition={{ duration: 0.5 }} // Animation duration
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
                className="h-6 w-6 text-rose-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
              </svg>
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight text-black">
              Sign up to create an account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/signin" // Set the 'to' prop to the target route
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Sign In here
              </Link>
            </p>
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">
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
