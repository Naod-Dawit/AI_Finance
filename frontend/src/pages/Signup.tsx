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
    

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");

    if (validateForm()) {
      dispatch(signup(formData) as any).then(() => navigate("/profile"));
    }
  };

  return (
    <div>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}

      <div className="flex flex-wrap w-[1132px] h-[773.8px]   mx-auto mt-6 p-6 ">
        {/* Welcome Block */}

        <div className="w-[431.01px] h-[733.8px]   p-4 bg-custom-linear-bg text-[#00FF1E] rounded-3xl md:rounded-r-none text-[27.55px]">
          <br />
          <br />

          <h1 className="">Welcome!</h1>
          <br />
          <br />
          <p className="mt-2">
            We're excited to help you take control of your finances. Here's what
            you can do:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              Track Expenses: Keep a record of all your expenses, big or small.
            </li>
            <li>Set Savings Goals: Plan ahead and save smarter.</li>
            <li>
              Visualize Your Finances: Gain insights with charts and reports.
            </li>
          </ul>
        </div>

        {/* Input Form Block */}
        <div className="w-full md:w-1/2 p-4 bg-[#282626]  rounded-3xl md:rounded-l-none">
          <h1 className="text-5xl text-center font-bold text-blue-500 ">
            Sign Up
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-[139px]">
            <div className="flex flex-col gap-y-1">
              <label
                htmlFor="email"
                className="block  font-medium text-[#C66363] text-3xl"
              >
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#ffab2c] focus:border-[#3b82f6] p-2 bg-[#E3DADA] h-[60px] "
              />
              {formErrors.email && (
                <div className="text-red-600 text-sm mt-1">
                  {formErrors.email}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-1">
              <label
                htmlFor="password"
                className="block  font-medium text-[#C66363] text-3xl"
              >
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-[#ffab2c] focus:border-[#3b82f6]p-2 bg-[#E3DADA] h-[60px]"
              />
              {formErrors.password && (
                <div className="text-red-600 text-sm">
                  {formErrors.password}
                </div>
              )}
            </div>

            <div className="flex justify-between w-full items-center text-2xl">
              <Link
                to="/terms"
                className="text-[#FFFFFF] font-sans text-1xl "
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </Link>
              <button
                type="submit"
                className="bg-[#FFFFFF] w-[160px] h-[80px] text-center rounded-3xl "
                
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
          <br />
          <Link
            to="/signin"
            rel="noopener noreferrer"
            className=" flex justify-center items-end text-[#2222ee] font-sans text-2xl"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
}
