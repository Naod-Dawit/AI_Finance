import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchDetails, profile, ProfileDetails } from "../features/auth/authSlice";
import { RootState, useAppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import '../assets/dollar.svg'

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, profileUpdated } = useSelector(
    (state: RootState) => state.reducers.auth
  );

  const [formData, setFormData] = useState<any>({
    name: "",
    monthlyIncome: "",
    goal: "",
    customGoal: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [customGoal, setCustomGoal] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.monthlyIncome) newErrors.monthlyIncome = "Monthly income is required";
    if (!formData.goal) newErrors.goal = "Goal is required";
    if (customGoal && !formData.customGoal) newErrors.customGoal = "Custom Goal is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submissionData: ProfileDetails = {
      ...formData,
      goal: customGoal ? formData.customGoal : formData.goal,
      amount: ""
    };

    await dispatch(profile(submissionData) as any);
    navigate("/expenses");
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await dispatch(fetchDetails()).unwrap();
      setFormData({
        ...formData,
        name: res.name || "",
        monthlyIncome: res.monthlyIncome || "",
        goal: res.goal || "",
      });
    };
    fetch();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (name === "goal") setCustomGoal(value === "Custom Goal");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Section: Motivational Content */}
          <div className="flex flex-col items-center md:items-start space-y-6">
            <h1 className="text-4xl font-extrabold text-blue-400">
              Build Your Financial Future
            </h1>
            <p className="text-lg text-gray-300">
              Your profile helps us tailor financial tools and advice just for
              you. Take the first step toward better financial management.
            </p>
        
          </div>

          {/* Right Section: Update Profile Form */}
          <div className="max-w-lg mx-auto bg-gradient-to-b from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">
              Update Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {["name", "monthlyIncome"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    placeholder={`Enter your ${field}`}
                  />
                  {errors[field] && (
                    <div className="text-xs text-red-400 mt-2">
                      {errors[field]}
                    </div>
                  )}
                </div>
              ))}

              <div>
                <label
                  htmlFor="goal"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Goal
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  <option value="" disabled>
                    Select a Goal
                  </option>
                  {["Save More Money", "Invest in Stocks", "Pay Off Debt", "Custom Goal"].map(
                    (goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    )
                  )}
                </select>
                {errors.goal && (
                  <div className="text-xs text-red-400 mt-2">{errors.goal}</div>
                )}
              </div>

              {customGoal && (
                <div>
                  <label
                    htmlFor="customGoal"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Custom Goal
                  </label>
                  <textarea
                    name="customGoal"
                    value={formData.customGoal}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    placeholder="Describe your custom goal"
                  />
                  {errors.customGoal && (
                    <div className="text-xs text-red-400 mt-2">
                      {errors.customGoal}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
              {error && (
                <div className="text-sm text-red-400 mt-4">{error}</div>
              )}
              {profileUpdated && (
                <div className="text-sm text-green-400 mt-4">
                  Profile updated successfully!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Section: Motivational Quote */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 italic text-lg">
            "Your financial journey starts with a single step. Update your
            profile and take control of your goals today."
          </p>
        </div>
      </div>
    </>
  );
  
  
}
