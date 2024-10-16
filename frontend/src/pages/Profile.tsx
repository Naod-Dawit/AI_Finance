import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { profile, ProfileDetails } from "../features/auth/authSlice";
import { RootState, useAppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";

const ProfileSchema = Yup.object().shape({
  amount: Yup.string().required("Amount is required"),
  goal: Yup.string().required("Goal is required"),
  name: Yup.string().required("Name is required"),
  monthlyIncome: Yup.string().required("Monthly income is required"),
});
export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, profileUpdated } = useSelector(
    (state: RootState) => state.reducers.auth
  );

  const [customGoal, setCustomGoal] = useState(false);

  const handleSubmit = (
    values: ProfileDetails,
    { setSubmitting }: FormikHelpers<ProfileDetails>
  ) => {
    dispatch(profile(values) as any).then(() => {
      setSubmitting(false);
      navigate("/expenses");
    });
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl text-center text-blue-600 py-4 bg-blue-50 shadow-md">
        Update Profile
      </h1>
      <Formik
        initialValues={{ amount: "", name: "", monthlyIncome: "", goal: "" }}
        validationSchema={ProfileSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            {["name", "monthlyIncome", "amount"].map((field) => (
              <div key={field} className="mb-4">
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field === "amount"
                    ? "Bank Balance"
                    : field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                  :
                </label>
                <Field
                  name={field}
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 p-2"
                />
                <ErrorMessage
                  name={field}
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            ))}

            <div className="mb-4">
              <label
                htmlFor="goal"
                className="block text-sm font-medium text-gray-700"
              >
                Goal
              </label>
              <Field
                as="select"
                name="goal"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 p-2"
                onChange={(e: { target: { value: string; }; }) => {
                  setFieldValue("goal", e.target.value);
                  setCustomGoal(e.target.value === "Custom Goal");
                }}
              >
                <option value="">Select a Goal</option>
                {[
                  "Save More Money",
                  "Invest in Stocks",
                  "Pay Off Debt",
                  "Custom Goal",
                ].map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="goal"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </div>

            {customGoal && (
              <div className="mb-4">
                <label
                  htmlFor="customGoal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Custom Goal:
                </label>
                <Field
                  name="goal"
                  type="text"
                  className="mt-1 block w-full h-28 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 p-2"
                />
                <ErrorMessage
                  name="goal"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-500 transition duration-200"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
            {profileUpdated && (
              <div className="text-green-600 text-sm mt-1">
                Profile updated successfully!
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
