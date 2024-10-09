import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { RootState, useAppDispatch } from "../store/store";
import { fetchDetails, ProfileDetails } from "../features/auth/authSlice";
import { Field, Form, Formik } from "formik";
import { updateExpenses } from "../features/auth/expensesSlice";
import { useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit"; // Import nanoid for unique IDs

export default function Homepage() {
  const [data, setData] = useState<ProfileDetails | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [customFields, setCustomFields] = useState<string[]>([]); // State to track custom fields

  const expenses = useSelector(
    (state: RootState) => state.reducers.expenses.expenses
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("You are not logged in ");
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

  const handleSubmit = (values: any) => {
    dispatch(updateExpenses(values));
  };

  // Function to add a new custom expense field with a unique name
  const handleAddExpense = () => {
    const name = prompt("Enter custom Expense Name");
    if (name) {
      const newFieldName = `${name}_${nanoid(5)}`; // Create a unique name with user input and a unique ID
      setCustomFields([...customFields, newFieldName]); // Update custom fields state with the new unique field name
    }
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
        initialValues={expenses}
        onSubmit={handleSubmit}
        enableReinitialize={true} // Reinitialize form with new fields
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="rent">Rent</label>
              <Field name="rent" type="number" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="car_payment">Car Payment</label>
              <Field name="car_payment" type="number" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="Monthly_saving">Monthly Saving</label>
              <Field name="Monthly_saving" type="number" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="Food">Food</label>
              <Field name="Food" type="number" className="w-full p-2 border rounded" />
            </div>

            {customFields.map((field) => (
              <div key={field} className="mt-4">
                <label htmlFor={field}>Custom Expense: {field.split("_")[0]}</label>
                <Field
                  name={field}
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder={`Enter amount for ${field.split("_")[0]}`}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddExpense}
              className="bg-blue-500 text-white p-2 rounded mt-4"
            >
              + Add Custom Expense
            </button>

            <div className="mt-4">
              <button type="submit" className="bg-green-500 text-white p-2 rounded">
                Update Expenses
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
