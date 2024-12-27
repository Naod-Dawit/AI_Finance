import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../features/auth/authSlice";
import { RootState } from "../store/store";
import { useNavigate, Link } from "react-router-dom";

export default function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state: RootState) => state.reducers.auth);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signin(formData) as any).then(() => navigate("/"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ">
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Section: Welcome Back Content */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-4xl font-extrabold text-green-400">
            Welcome Back!
          </h1>
          <p className="text-lg text-gray-300">
            Ready to dive back into managing your finances? Here's what you can
            do:
          </p>
          <ul className="list-disc pl-6 space-y-4 text-gray-300">
            <li>Review past expenses with detailed charts.</li>
            <li>Stay on track with your savings goals.</li>
            <li>Plan ahead with personalized financial insights.</li>
          </ul>
        </div>

        {/* Right Section: Sign In Form */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-green-400 mb-8">
            Sign In
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
                className="block w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
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
                className="block w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
              />
              {formErrors.password && (
                <div className="text-xs text-red-400">
                  {formErrors.password}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link
                to="/forgot-password"
                className="text-gray-300 text-sm hover:text-gray-100 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Forgot Password?
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-200"
                onClick={handleSubmit}
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/signup"
              className="text-blue-400 text-sm hover:text-blue-300"
            >
              Don't have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Quote Section */}
      <div className="mt-12 text-center pb-8">
        <p className="text-gray-400 italic text-lg">
          "Continue your journey to financial success."
        </p>
      </div>
    </div>
  );
}
