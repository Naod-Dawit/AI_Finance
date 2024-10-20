import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";
import { useAppDispatch } from "../store/store";
import { fetchDetails, ProfileDetails } from "../features/auth/authSlice";
import {
  updateExpenses,
  addCustomExpense,
  removeCustomExpense,
  CustomExpense,
  getExpenses,
} from "../features/auth/expensesSlice";

export default function Expenses() {
  const [data, setData] = useState<ProfileDetails | null>(null);
  const [customFields, setCustomFields] = useState<CustomExpense[]>([]);
  const [formData, setFormData] = useState({
    rent: 0,
    car_payment: 0,
    Monthly_saving: 0,
    food: 0,
  });

  const [customOpen, setCustomOpen] = useState(false); // State for accordion
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");

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
        const response = await dispatch(getExpenses()).unwrap();
        const { rent = 0, food = 0,Monthly_saving=0, car_Payment = 0, customExpenses = [] } =
          response;

        setFormData({
          ...formData,
          rent,
          food,
          Monthly_saving,
          car_payment: car_Payment,
        });
        setCustomFields(customExpenses);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      }
    };
    fetchExpenses();
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
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
      await dispatch(
        updateExpenses({
          ...formData,
          customExpenses: customFields,
          car_Payment: 0,
          others: 0
        })
      ).unwrap();
      alert("Expenses updated successfully");
      navigate("/");
    } catch (err) {
      alert("Failed to update expenses");
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
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl mb-6">
        Welcome to AI Finance Management{" "}
        <span className="italic text-blue-800 font-black">
          {data ? data.name : "Guest"}
        </span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 bg-white rounded shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-6">Expense Tracker</h2>

          <h1  className="text-center text-2xl m-5">BASIC EXPENSES</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(formData).map(([field, value]) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-gray-700 font-medium mb-2"
              >
                {field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
              </label>
              <input
                id={field}
                name={field}
                type="number"
                value={value}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
        </div>

        {/* Accordion for Custom Expenses */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setCustomOpen(!customOpen)}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            {customOpen ? "Hide Custom Expenses" : "Show Custom Expenses"}
          </button>

          {customOpen && (
            <div className="mt-4 max-h-64 overflow-y-auto">
              {customFields.map((field) => (
                <div
                  key={field.id}
                  className="mb-4 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={field.name}
                    disabled
                    className="flex-grow p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    value={field.amount}
                    onChange={(e) =>
                      handleCustomExpenseChange(
                        field.id,
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-24 p-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExpense(field.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddExpense}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
        >
          + Add Custom Expense
        </button>

        <div className="mt-6 sticky bottom-0 bg-white p-4">
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
          >
            Update Expenses
          </button>
        </div>
      </form>
    </div>
  );
}
