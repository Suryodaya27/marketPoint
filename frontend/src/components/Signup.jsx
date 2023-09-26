import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        navigate("/login");
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
    <section>
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
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Sign up to create an account
          </h2>
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="text-base font-medium text-gray-900">
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
                  <label htmlFor="password" className="text-base font-medium text-gray-900">
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
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Create Account <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
