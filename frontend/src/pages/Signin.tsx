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
    <div className="flex flex-wrap w-[1132px] h-[773.8px] mx-auto mt-6 p-6">
      {/* Welcome Block */}
      <div className="w-[431.01px] h-[733.8px] p-4 bg-gradient-to-r from-[#1b1b1b]  to-[#5a3081] text-white rounded-md md:rounded-r-none text-[27.55px]">
        <br />
        <br />
        <h1 className="text-[30px]">Welcome Back!</h1>
        <br />
        <br />
        <p className="mt-2">
          Ready to dive back into managing your finances? Here's what you can do:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2">
          <li>Review past expenses with detailed charts.</li>
          <li>Stay on track with your savings goals.</li>
          <li>Plan ahead with personalized financial insights.</li>
        </ul>
      </div>

      {/* Input Form Block */}
      <div className="w-full md:w-1/2 p-4 bg-gray-800 rounded-md md:rounded-l-none">
        <h1 className="text-5xl text-center font-bold text-green-400">
          Sign In
        </h1>
        {error && (
          <div className="text-red-600 text-center mt-2 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-[139px] text-[#ffd700] text-3xl">
          <div className="flex flex-col gap-y-2">
            <label
              htmlFor="email"
              className="  font-medium"
            >
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-green-300 focus:border-green-500 p-2 bg-gray-700 text-white h-[60px]"
            />
            {formErrors.email && (
              <div className="text-red-600 text-sm">{formErrors.email}</div>
            )}
          </div>

          <div className="flex flex-col gap-y-2">
            <label
              htmlFor="password"
              className=" font-medium"
            >
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-green-300 focus:border-green-500 p-2 bg-gray-700 text-white h-[60px]"
            />
            {formErrors.password && (
              <div className="text-red-600 text-sm">{formErrors.password}</div>
            )}
          </div>

          <div className="flex justify-between items-center text-2xl">
            <Link
              to="/forgot-password"
              className="text-green-300 font-sans text-1xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Forgot Password?
            </Link>
            <button
              type="submit"
              className="bg-green-500 w-[160px] h-[80px] text-center text-black rounded-3xl hover:bg-green-400"
              onClick={handleSubmit}
            >
              Sign In
            </button>
          </div>
        </form>
        <br />
        <Link
          to="/signup"
          className="flex justify-center items-end text-blue-300 font-sans text-2xl"
        >
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}
