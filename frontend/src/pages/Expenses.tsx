import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";
import { RootState, useAppDispatch } from "../store/store";
import { fetchDetails, ProfileDetails } from "../features/auth/authSlice";
import {
  updateExpenses,
  addCustomExpense,
  removeCustomExpense,
  CustomExpense,
  getExpenses,
  editExpenses,
} from "../features/auth/expensesSlice";
import { useSelector } from "react-redux";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import Navbar from "./navbar/Navbar";

export default function Expenses() {
  const [data, setData] = useState<ProfileDetails | null>(null);
  const [customFields, setCustomFields] = useState<CustomExpense[]>([]);

  const [formData, setFormData] = useState({
    Housing: 0,
    food: 0,
    Monthly_saving_Goal: 0,
    Transportation: {
      mode: "public",
      cost: 0,
      carPayment: 0,
      insurance: 0,
    },
  });
  const [activeTab, setActiveTab] = useState("Basic Expenses");

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const [customOpen, setCustomOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const { expensesUpdated } = useSelector(
    (state: RootState) => state.reducers.expenses
  );

  useEffect(() => {
    if (!token) {
      alert("You are not logged in");
      navigate("/signup");
    } else {
      dispatch(fetchDetails()).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          setData(response.payload as ProfileDetails);
        } else {
          alert("Failed to fetch profile details.");
        }
      });
    }
  }, [dispatch, navigate, token]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = (await dispatch(getExpenses()).unwrap())[
          new Date().getMonth()
        ];

        const {
          food = 0,
          Monthly_saving_Goal = 0,
          Transportation = {
            mode: "public",
            cost: 0,
            carPayment: 0,
            insurance: 0,
          },
          Housing = 0,
        } = response;
        setFormData({ food, Monthly_saving_Goal, Housing, Transportation });
        console.log(response);

        setCustomFields(response.customExpenses);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      }
    };

    if (expensesUpdated) {
      fetchExpenses();
    }
  }, [dispatch, expensesUpdated,navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle Transportation fields
    if (name === "TransportationMode") {
      setFormData((prev) => ({
        ...prev,
        Transportation: { ...prev.Transportation, mode: value },
      }));
    } else if (["cost", "carPayment", "insurance"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        Transportation: {
          ...prev.Transportation,
          [name]: parseFloat(value) || 0,
        },
      }));
    } else {
      // Handle other fields
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    }
  };

  const handleCustomExpenseChange = (id: string, amount: number) => {
    setCustomFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, amount } : field
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const hasValidExpenses =
        customFields.length > 0 ||
        Object.values(formData).some((val) => {
          if (typeof val === "number" && val >= 0) return true;
          if (val && typeof val === "object") {
            return (
              (val?.cost ?? 0) >= 0 &&
              (val?.carPayment ?? 0) >= 0 &&
              (val?.insurance ?? 0) >= 0
            );
          }
          return false;
        });

      if (hasValidExpenses) {
        await dispatch(
          editExpenses({
            ...formData,
            customExpenses: customFields,
          })
        ).unwrap();
        alert("Expenses updated successfully.");
      } else {
        await dispatch(
          updateExpenses({
            ...formData,
            customExpenses: customFields,
          })
        ).unwrap();
        alert("Expenses added successfully.");
      }
      navigate("/");
      location.reload();
    } catch (err) {
      console.error("Failed to submit expenses:", err);
      alert("Error submitting expenses. Please try again.");
    }
  };

  const handleAddExpense = () => {
    const name = prompt("Enter custom expense name");
    if (name) {
      const newExpense: CustomExpense = {
        id: nanoid(),
        name,
        amount: 0,
      };
      setCustomFields([...customFields, newExpense]);
      dispatch(addCustomExpense(newExpense));
    }
  };

  const handleRemoveExpense = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
    dispatch(removeCustomExpense(id));
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen">
        <h1 className="text-center text-3xl mb-10 text-white font-bold tracking-tight">
          AI Finance Management for{" "}
          <span className="text-blue-400 italic">
            {data ? data.name : "Guest"}
          </span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-700 overflow-hidden"
        >
          {/* Expense Tracker Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-4xl font-extrabold text-center text-white">
              Expense Tracker
            </h2>
          </div>

          {/* Main Form Content */}
          <div className="p-8 space-y-8">
            {/* Basic Expenses Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(formData)
                .filter(([key]) => key !== "Transportation")
                .map(([field, value]) => (
                  <div key={field} className="group relative">
                    <input
                      id={field}
                      name={field}
                      type="number"
                      value={typeof value === "number" ? value : value.cost}
                      onChange={handleInputChange}
                      className="peer w-full p-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 placeholder-transparent"
                      placeholder={`Enter ${field}`}
                    />
                    <label
                      htmlFor={field}
                      className="absolute left-3 -top-3 bg-gray-800 px-2 text-sm text-gray-400 transition-all duration-300 
                        peer-placeholder-shown:top-4 
                        peer-placeholder-shown:text-base 
                        peer-focus:-top-3 
                        peer-focus:text-sm 
                        peer-focus:text-blue-400"
                    >
                      {field.charAt(0).toUpperCase() +
                        field.slice(1).replaceAll("_", " ")}
                    </label>
                  </div>
                ))}
            </div>

            {/* Transportation Section */}
            <div className="bg-gray-700 rounded-lg p-6 space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Transportation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative">
                  <select
                    id="TransportationMode"
                    name="TransportationMode"
                    value={formData.Transportation.mode}
                    onChange={handleInputChange}
                    className="peer w-full p-4 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="public">Public Transportation</option>
                    <option value="personal">Personal Vehicle</option>
                  </select>
                  <label
                    htmlFor="TransportationMode"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="cost"
                    name="cost"
                    type="number"
                    value={formData.Transportation.cost || 0}
                    onChange={handleInputChange}
                    className="peer w-full p-4 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
                    placeholder="Transportation Cost"
                  />
                  <label
                    htmlFor="cost"
                    className="absolute left-3 -top-3 bg-gray-700 px-2 text-sm text-gray-400 transition-all duration-300 
                      peer-placeholder-shown:top-4 
                      peer-placeholder-shown:text-base 
                      peer-focus:-top-3 
                      peer-focus:text-sm 
                      peer-focus:text-blue-400"
                  >
                    Transportation Cost
                  </label>
                </div>

                {formData.Transportation.mode === "personal" && (
                  <>
                    <div className="relative">
                      <input
                        id="carPayment"
                        name="carPayment"
                        type="number"
                        value={formData.Transportation.carPayment}
                        onChange={handleInputChange}
                        className="peer w-full p-4 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
                        placeholder="Car Payment"
                      />
                      <label
                        htmlFor="carPayment"
                        className="absolute left-3 -top-3 bg-gray-700 px-2 text-sm text-gray-400 transition-all duration-300 
                          peer-placeholder-shown:top-4 
                          peer-placeholder-shown:text-base 
                          peer-focus:-top-3 
                          peer-focus:text-sm 
                          peer-focus:text-blue-400"
                      >
                        Car Payment
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        id="insurance"
                        name="insurance"
                        type="number"
                        value={formData.Transportation.insurance}
                        onChange={handleInputChange}
                        className="peer w-full p-4 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
                        placeholder="Insurance Cost"
                      />
                      <label
                        htmlFor="insurance"
                        className="absolute left-3 -top-3 bg-gray-700 px-2 text-sm text-gray-400 transition-all duration-300 
                          peer-placeholder-shown:top-4 
                          peer-placeholder-shown:text-base 
                          peer-focus:-top-3 
                          peer-focus:text-sm 
                          peer-focus:text-blue-400"
                      >
                        Insurance Cost
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Custom Expenses Section */}
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  Custom Expenses
                </h3>
                <button
                  type="button"
                  onClick={handleAddExpense}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors duration-300"
                >
                  <Plus className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customFields.map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-gray-600 rounded-lg p-4 flex items-center space-x-4"
                  >
                    <div className="flex-grow relative">
                      <input
                        id={expense.id}
                        type="number"
                        value={expense.amount}
                        onChange={(e) =>
                          handleCustomExpenseChange(
                            expense.id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="peer w-full p-3 bg-gray-500 text-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-transparent"
                        placeholder="Enter amount"
                      />
                      <label
                        htmlFor={expense.id}
                        className="absolute left-3 -top-3 bg-gray-600 px-2 text-sm text-gray-400 transition-all duration-300 
                          peer-placeholder-shown:top-4 
                          peer-placeholder-shown:text-base 
                          peer-focus:-top-3 
                          peer-focus:text-sm 
                          peer-focus:text-blue-400"
                      >
                        {expense.name}
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExpense(expense.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-8">
              <button
                type="submit"
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full 
                hover:from-blue-700 hover:to-purple-700 
                focus:outline-none focus:ring-4 focus:ring-blue-300 
                transition-all duration-300 transform hover:scale-105"
              >
                Submit Expenses
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
