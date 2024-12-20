import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [goodbyeMessage, setGoodbyeMessage] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");

    setGoodbyeMessage(true);
    setTimeout(() => {
      setGoodbyeMessage(false);
      navigate("/signup");
    }, 5000);
  };

  return (
    <>
      <nav className="bg-gray-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-400">
            FinanceApp
          </Link>
          <div className="space-x-6">
            <Link
              to="/"
              className="hover:text-green-400 transition duration-200"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-green-400 transition duration-200"
            >
              About
            </Link>
            <Link
              to="/expenses"
              className="hover:text-green-400 transition duration-200"
            >
              Expenses
            </Link>
            <Link
              to="/profile"
              className="hover:text-green-400 transition duration-200"
            >
              Profile
            </Link>
            <button
              className="hover:text-red-500 transition duration-200"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>
      {goodbyeMessage && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 text-white text-xl"
          style={{
            animation: "fade-in-out 3s ease-in-out",
          }}
        >
          Thanks for using our service. Come back again!
        </div>
       
      )}
       <style>{`@keyframes`}
          
          </style>
    </>
  );
}
