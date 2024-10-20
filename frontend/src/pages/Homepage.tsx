import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import {
  CustomExpense,
  ExpenseDetails,
  getExpenses,
} from "../features/auth/expensesSlice";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { fetchDetails } from "../features/auth/authSlice";
import Expenses from "./Expenses";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

export default function Homepage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<ExpenseDetails>({
    Monthly_saving: 0,
    rent: 0,
    car_Payment: 0,
    food: 0,
    others: 0,
    customExpenses: [],
  });
  const [MonthlyIncome, SetMonthlyIncome] = useState<number>(0);
  const [TotalExpenses, setTotalExpenses] = useState<number>(0);
  const [showEdit, setShowEdit] = useState(false);

  const [activechart, Setactivechart] = useState<boolean>(false);

  const FETCHEXPENSES = () => {
    dispatch(getExpenses())
      .unwrap()
      .then((response: any) => {
        const {
          rent = 0,
          food = 0,
          car_Payment = 0,
          customExpenses = [],
        } = response;
        const customExpensesTotal = customExpenses.reduce(
          (total: number, expense: CustomExpense) =>
            total + (expense.amount || 0),
          0
        );
        setData(response);
        setTotalExpenses(rent + food + car_Payment + customExpensesTotal);
      })
      .catch((err) => console.error("Failed to fetch expenses:", err));
  };

  const FETCHDETAILS = () => {
    dispatch(fetchDetails()).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        SetMonthlyIncome(response.payload.monthlyIncome as number);
      } else {
        alert("Failed to fetch profile details.");
      }
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signup");
    FETCHDETAILS();

    FETCHEXPENSES();
  }, [dispatch, navigate]);

  const pieChartData = {
    labels: [
      "Monthly Saving",
      "Food",
      "Rent",
      "Car Payment",
      ...(data.customExpenses.map((e) => e.name) || []),
    ],
    datasets: [
      {
        data: [
          data.Monthly_saving || 0,
          data.food || 0,
          data.rent || 0,
          data.car_Payment || 0,
          ...(data.customExpenses.map((e) => e.amount) || []),
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const lineChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Percentage Spent on Expenses",
        data: [50, 60, 45, 55, 70, 65, 75],
        borderColor: "#36A2EB",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Expense Distribution" },
    },
  };

  return (
    <div className="container mx-auto p-8 space-y-12">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Financial Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your expenses and savings effectively.
        </p>
      </div>

      {/* Summary and Pie Chart Section */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Expense Summary
          </h2>
          <p className="text-gray-600">
            Total Monthly Income:{" "}
            <span className="font-medium">${MonthlyIncome.toFixed(2)}</span>
          </p>
          <p className="text-gray-600">
            Total Expenses:{" "}
            <span className="font-medium">${TotalExpenses.toFixed(2)}</span>
          </p>
          <p className="text-gray-600">
            Net Savings:{" "}
            <span className="font-medium">
              ${(MonthlyIncome - data.Monthly_saving).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Expense Distribution
          </h2>
          <Pie data={pieChartData} />
        </div>
      </div>

      {/* Line Chart Section */}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Expense Trend
        </h2>
        <Line data={lineChartData} />
      </div>

      {/* Edit Expenses Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowEdit(!showEdit)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full shadow-md transition"
        >
          {showEdit ? "Close Edit" : "⚙ Edit Expenses"}
        </button>
      </div>

      {/* Edit Expenses Component */}
      {showEdit && (
        <div className="mt-8">
          <Expenses />
        </div>
      )}
    </div>
  );
}
