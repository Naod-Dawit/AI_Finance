import React, { useState } from "react";
import { useSelector } from "react-redux";
import { signup } from "../features/auth/authSlice";
import { RootState, useAppDispatch } from "../store/store";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
export default function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector(
    (state: RootState) => state.reducers.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear individual field error when user starts typing
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    const errors: any={}

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    setFormErrors(errors);
    console.log(errors);
    

    return Object.keys(errors).length === 0; 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");

    if (validateForm()) {
      dispatch(signup(formData) as any).then(() => navigate("/profile"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Section: Welcome Content */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-4xl font-extrabold text-blue-400">
            Welcome!
          </h1>
          <p className="text-lg text-gray-300">
            We're excited to help you take control of your finances. Here's what
            you can do:
          </p>
          <ul className="list-disc pl-6 space-y-4 text-gray-300">
            <li>
              Track Expenses: Keep a record of all your expenses, big or small.
            </li>
            <li>Set Savings Goals: Plan ahead and save smarter.</li>
            <li>
              Visualize Your Finances: Gain insights with charts and reports.
            </li>
          </ul>
        </div>

        {/* Right Section: Sign Up Form */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">
            Sign Up
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              />
              {formErrors.email && (
                <div className="text-xs text-red-400">{formErrors.email}</div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              />
              {formErrors.password && (
                <div className="text-xs text-red-400">{formErrors.password}</div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link
                to="/terms"
                className="text-gray-300 text-sm hover:text-gray-100 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/signin"
              className="text-blue-400 text-sm hover:text-blue-300"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Quote Section */}
      <div className="mt-12 text-center pb-8">
        <p className="text-gray-400 italic text-lg">
          "Take control of your financial future today."
        </p>
      </div>
    </div>
  );
}
