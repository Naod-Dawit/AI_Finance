import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchDetails, profile, ProfileDetails } from "../features/auth/authSlice";
import { RootState, useAppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";

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
    <div className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl text-3xl w-full h-full">
      <h1 className="text-4xl text-center font-bold text-blue-400 mb-6">
        Update Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {["name", "monthlyIncome"].map((field:any) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-lg font-semibold text-gray-300 mb-2"
            >
              {field.charAt(0).toUpperCase() +
                field.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              className="block w-full border border-gray-600 bg-gray-700 rounded-lg shadow-sm p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter your ${field}`}
            />
            {errors[field] && (
              <div className="text-sm text-red-500 mt-2">{errors[field]}</div>
            )}
          </div>
        ))}
  
        <div>
          <label htmlFor="goal" className="block text-lg font-semibold text-gray-300 mb-2">
            Goal
          </label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            className="block w-full border border-gray-600 bg-gray-700 rounded-lg shadow-sm p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="text-sm text-red-500 mt-2">{errors.goal}</div>
          )}
        </div>
  
        {customGoal && (
          <div>
            <label
              htmlFor="customGoal"
              className="block text-lg font-semibold text-gray-300 mb-2"
            >
              Custom Goal:
            </label>
            <textarea
              name="customGoal"
              value={formData.customGoal}
              onChange={handleInputChange}
              className="block w-full h-32 border border-gray-600 bg-gray-700 rounded-lg shadow-sm p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your custom goal"
            />
            {errors.customGoal && (
              <div className="text-sm text-red-500 mt-2">{errors.customGoal}</div>
            )}
          </div>
        )}
  
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg shadow hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        {error && <div className="text-sm text-red-500 mt-3">{error}</div>}
        {profileUpdated && (
          <div className="text-sm text-green-500 mt-3">Profile updated successfully!</div>
        )}
      </form>
    </div>
    </>
  );
  
  
}
