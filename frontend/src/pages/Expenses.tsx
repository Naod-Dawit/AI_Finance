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
  }, [dispatch, expensesUpdated, navigate]);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-center mb-12">
            Welcome back,{" "}
            <span className="font-semibold">{data ? data.name : "Guest"}</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl">
              {/* Header */}
              <div className="px-6 py-8 border-b border-slate-700/50">
                <h2 className="text-3xl font-semibold text-white text-center">
                  Track Your Expenses
                </h2>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-10">
                {/* Basic Expenses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(formData)
                    .filter(([key]) => key !== "Transportation")
                    .map(([field, value]) => (
                      <div key={field} className="relative">
                        <label
                          htmlFor={field}
                          className="absolute -top-6 left-2 px-2 bg-slate-800 text-sm text-slate-400 transition-all"
                        >
                          {field.charAt(0).toUpperCase() +
                            field.slice(1).replaceAll("_", " ")}
                        </label>
                        <input
                          id={field}
                          name={field}
                          type="number"
                          value={typeof value === "number" ? value : value.cost}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900/50 text-slate-100 rounded-2xl px-4 py-4 border border-slate-700 
                            focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                            placeholder-transparent"
                          placeholder={field}
                        />
                      </div>
                    ))}
                </div>

                {/* Transportation Section */}
                <div className="bg-slate-900/30 rounded-xl p-6">
                  <h3 className="text-xl font-medium text-white mb-6">
                    Transportation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="relative">
                      <label
                        htmlFor="TransportationMode"
                        className="absolute -top-6 left-2 px-2 bg-slate-800 text-sm text-slate-400"
                      >
                        Transportation Mode
                      </label>
                      <select
                        id="TransportationMode"
                        name="TransportationMode"
                        value={formData.Transportation.mode}
                        onChange={handleInputChange}
                        className="w-full bg-slate-800 text-slate-100 rounded-2xl px-4 py-4 border border-slate-700
                          appearance-none focus:ring-4 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="public">Public Transportation</option>
                        <option value="personal">Personal Vehicle</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="cost"
                        className="absolute -top-6 left-2 px-2 bg-slate-900/30 text-sm text-slate-400"
                      >
                        Transportation Cost
                      </label>
                      <input
                        id="cost"
                        name="cost"
                        type="number"
                        value={formData.Transportation.cost || 0}
                        onChange={handleInputChange}
                        className="w-full bg-slate-800 text-slate-100 rounded-2xl px-4 py-4 border border-slate-700
                          focus:ring-4 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
                        placeholder="Cost"
                      />
                    </div>

                    {formData.Transportation.mode === "personal" && (
                      <>
                        <div className="relative">
                          <label
                            htmlFor="carPayment"
                            className="absolute -top-6 left-2 px-2 bg-slate-900/30 text-sm text-slate-400"
                          >
                            Car Payment
                          </label>
                          <input
                            id="carPayment"
                            name="carPayment"
                            type="number"
                            value={formData.Transportation.carPayment}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 text-slate-100 rounded-2xl px-4 py-4 border border-slate-700
                              focus:ring-4 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
                            placeholder="Car Payment"
                          />
                        </div>
                        <div className="relative">
                          <label
                            htmlFor="insurance"
                            className="absolute -top-6 left-2 px-2 bg-slate-900/30 text-sm text-slate-400"
                          >
                            Insurance
                          </label>
                          <input
                            id="insurance"
                            name="insurance"
                            type="number"
                            value={formData.Transportation.insurance}
                            onChange={handleInputChange}
                            className="w-full bg-slate-800 text-slate-100 rounded-2xl px-4 py-4 border border-slate-700
                              focus:ring-4 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
                            placeholder="Insurance"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Custom Expenses */}
                <div className="bg-slate-900/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-medium text-white">
                      Other Expenses
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddExpense}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customFields.map((expense) => (
                      <div key={expense.id} className="relative group">
                        <label
                          htmlFor={expense.id}
                          className="absolute -top-6 left-2 px-2 bg-slate-900/30 text-sm text-slate-400"
                        >
                          {expense.name}
                        </label>
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
                          className="w-full bg-slate-800 text-slate-100 rounded-2xl px-4 py-4 border border-slate-700
                            focus:ring-4 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
                          placeholder="Amount"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExpense(expense.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
                            text-red-400 hover:text-red-300 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="px-6 py-8 border-t border-slate-700/50">
                <button
                  type="submit"
                  className="w-full sm:w-auto mx-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                    hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl
                    transform transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-blue-500/50
                    flex items-center justify-center gap-2"
                >
                  Save Expenses
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
