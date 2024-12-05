import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
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
        </div>
      </div>
    </nav>
  );
}
