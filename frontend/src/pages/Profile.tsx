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

  const [formData, setFormData] = useState({
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "goal") setCustomGoal(value === "Custom Goal");
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl text-center text-blue-600 py-4 bg-blue-50 shadow-md">
        Update Profile
      </h1>
      <form onSubmit={handleSubmit}>
        {["name", "monthlyIncome"].map((field) => (
          <div key={field} className="mb-4">
            <label htmlFor={field} className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 p-2"
            />
            {errors[field] && <div className="text-red-600 text-sm mt-1">{errors[field]}</div>}
          </div>
        ))}

        <div className="mb-4">
          <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
            Goal
          </label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 p-2"
          >
            <option value="">Select a Goal</option>
            {["Save More Money", "Invest in Stocks", "Pay Off Debt", "Custom Goal"].map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
          {errors.goal && <div className="text-red-600 text-sm mt-1">{errors.goal}</div>}
        </div>

        {customGoal && (
          <div className="mb-4">
            <label htmlFor="customGoal" className="block text-sm font-medium text-gray-700">
              Custom Goal:
            </label>
            <input
              type="text"
              name="customGoal"
              value={formData.customGoal}
              onChange={handleInputChange}
              className="mt-1 block w-full h-28 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 p-2"
            />
            {errors.customGoal && (
              <div className="text-red-600 text-sm mt-1">{errors.customGoal}</div>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-500 transition duration-200"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        {profileUpdated && (
          <div className="text-green-600 text-sm mt-1">Profile updated successfully!</div>
        )}
      </form>
    </div>
  );
}
