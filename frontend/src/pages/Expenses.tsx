import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { nanoid } from "@reduxjs/toolkit";
import { RootState, useAppDispatch } from "../store/store";
import { fetchDetails, ProfileDetails } from "../features/auth/authSlice";
import {
  updateExpenses,
  addCustomExpense,
  removeCustomExpense,
  CustomExpense,
} from "../features/auth/expensesSlice";

export default function Expenses() {
  const [data, setData] = useState<ProfileDetails | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [customFields, setCustomFields] = useState<CustomExpense[]>([]);

  const expenses = useSelector(
    (state: RootState) => state.reducers.expenses.expenses
  );
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

  const handleSubmit = async (values: any) => {
    await dispatch(updateExpenses({ ...values, customExpenses: customFields }))
      .unwrap()
      .then(() => alert("Expenses added successfully"))
      .then(() => navigate("/"))
      .catch((err) => alert(err));
  };

  const handleAddExpense = (e: any) => {
    e.preventDefault();

    const name = prompt("Enter custom Expense Name");
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
      <Formik
        initialValues={{
          rent: 0,
          car_payment: 0,
          Monthly_saving: 0,
          food: 0,
          customExpenses:
            expenses?.customExpenses?.map((expense) => ({
              id: expense.id,
              name: expense.name,
              amount: expense.amount ?? 0,
            })) ?? [],
        }}
        onSubmit={handleSubmit}
        enableReinitialize={false}
      >
        {({ isSubmitting }) => (
          <Form className="max-w-lg mx-auto p-6 bg-white rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Expense Tracker</h2>

            {/* Standard expense fields */}
            {["rent", "car_payment", "Monthly_saving", "food"].map((field) => (
              <div key={field} className="mb-4">
                <label
                  htmlFor={field}
                  className="block text-gray-700 font-medium"
                >
                  {field.charAt(0).toUpperCase() +
                    field.slice(1).replace("_", " ")}
                </label>
                <Field
                  name={field}
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="Enter amount in dollars"
                />
              </div>
            ))}

            {/* Custom expense fields */}
            {customFields.map((field) => (
              <div key={field.id} className="mb-4 flex items-center">
                <div className="flex-grow">
                  <label
                    htmlFor={field.name}
                    className="block text-gray-700 font-medium"
                  >
                    {field.name}
                  </label>
                  <Field
                    name={`${field.name}`}
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder={`Enter amount for ${field.name}`}
                    value={field.amount ?? ""} // Ensure controlled component
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const updatedValue = Number(e.target.value);
                      setCustomFields(
                        customFields.map((f) =>
                          f.id === field.id ? { ...f, amount: updatedValue } : f
                        )
                      );
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExpense(field.id)}
                  className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add custom expense button */}
            <button
              type="button"
              onClick={handleAddExpense}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
            >
              + Add Custom Expense
            </button>

            {/* Update expenses button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200"
              >
                {isSubmitting ? "Updating..." : "Update Expenses"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
