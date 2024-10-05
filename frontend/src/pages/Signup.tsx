import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../features/auth/authSlice";
import { RootState, useAppDispatch } from "../store/store";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
  username: Yup.string().min(3, "Too short").required("Required"),
});

export default function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (values: {
    email: string;
    password: string;
    username: string;
  }) => {
    dispatch(signup(values) as any).then(() => navigate("/profile"));
  };

  return (
    <>
      <h1 className="text-3xl text-center text-blue-600 py-4 bg-blue-50 shadow-md">
        Sign Up
      </h1>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}

      <div className="max-w-md mx-auto mt-6 p-6 bg-white rounded-lg shadow-lg">
        <Formik
          initialValues={{ email: "", password: "", username: "" }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username:
                </label>
                <Field
                  name="username"
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 p-2"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email:
                </label>
                <Field
                  name="email"
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 p-2"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password:
                </label>
                <Field
                  name="password"
                  type="password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500 p-2"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-500 transition duration-200"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
        <Link to="/signin" className="text-xs text-blue-900">
          Already have an account?
        </Link>
      </div>
    </>
  );
}
