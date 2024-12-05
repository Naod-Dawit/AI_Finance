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
import { Plus, Trash2 } from "lucide-react";
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
          customExpenses = [],
        } = response;
        setFormData({ food, Monthly_saving_Goal, Housing, Transportation });
        console.log(formData);

        setCustomFields(customExpenses);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      }
    };

    if (expensesUpdated) {
      fetchExpenses();
    }
  }, [dispatch, expensesUpdated]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "TransportationMode") {
      setFormData({
        ...formData,
        Transportation: { ...formData.Transportation, mode: value },
      });
    } else if (name in formData.Transportation) {
      setFormData({
        ...formData,
        Transportation: {
          ...formData.Transportation,
          [name]: parseFloat(value) || 0,
        },
      });
    } else {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    }
  };

  const handleCustomExpenseChange = (id: string, amount: number) => {
    setCustomFields(
      customFields.map((field) =>
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
      <div className="container mx-auto p-6 bg-gray-700 text-gray-200">
        <h1 className="text-center text-2xl mb-8">
          Welcome to AI Finance Management{" "}
          <span className="italic text-blue-400 font-bold">
            {data ? data.name : "Guest"}
          </span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-2xl border border-gray-700"
        >
          <h2 className="text-3xl font-semibold mb-8 text-center text-blue-400">
            Expense Tracker
          </h2>

          {/* Basic Expenses Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-x-200 ">
            {Object.entries(formData)
              .filter(([key]) => key !== "Transportation")
              .map(([field, value]) => (
                <div key={field} className="space-y-2">
                  <label
                    htmlFor={field}
                    className="block text-gray-300 font-medium"
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
                    className="w-full p-4 border bg-gray-700 border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
          </div>

          {/* Transportation Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2 ">
              <label
                htmlFor="TransportationMode"
                className="block text-gray-300 font-medium"
              >
                Transportation Mode
              </label>
              <select
                id="TransportationMode"
                name="TransportationMode"
                value={formData.Transportation.mode}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="public">Public</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="cost" className="block text-gray-300 font-medium">
                Transportation Cost
              </label>
              <input
                id="cost"
                name="cost"
                type="number"
                value={formData.Transportation.cost || 0}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Transportation Cost"
              />
            </div>

            {formData.Transportation.mode === "personal" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="carPayment"
                    className="block text-gray-300 font-medium"
                  >
                    Car Payment
                  </label>
                  <input
                    id="carPayment"
                    name="carPayment"
                    type="number"
                    value={formData.Transportation.carPayment}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Car Payment"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="insurance"
                    className="block text-gray-300 font-medium"
                  >
                    Insurance
                  </label>
                  <input
                    id="insurance"
                    name="insurance"
                    type="number"
                    value={formData.Transportation.insurance}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Insurance Cost"
                  />
                </div>
              </div>
            )}
          </div>
          <br />
          {/* Custom Expenses Section */}
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 ">
            <h3 className="text-xl text-gray-300 font-semibold">
              Custom Expenses
            </h3>
            <button
              type="button"
              onClick={handleAddExpense}
              className="text-blue-400 hover:text-blue-300 transition"
            >
              <Plus className="h-10 w-10 ml-[200%]" />
            </button>
            <div></div>

            {customFields.map((expense) => (
              <div
                key={expense.id}
                className="space-y-2 border-b border-gray-700 pb-4"
              >
                <label
                  htmlFor={expense.id}
                  className="block text-gray-300 font-medium"
                >
                  {expense.name}
                </label>
                <div className="flex items-center space-x-2">
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
                    className="flex-grow p-4 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExpense(expense.id)}
                    className="text-red-500 hover:text-red-400 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
