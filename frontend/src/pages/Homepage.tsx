import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import {
  CustomExpense,
  fetchOldExpenses,
  fetchPercentages,
  getExpenses,
} from "../features/auth/expensesSlice";
import { Line, Doughnut } from "react-chartjs-2";
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
import Navbar from "./navbar/Navbar";
import "../App.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);
import LoadingSpinner from "../assets/Loading";
import ErrorBoundary from "../assets/ErrorBoundary";
import { lineChartOptions, pieChartOptions } from "../utils/ChartConfigutation";
import { getActiveExpenseData, getLineChartData } from "../utils/chartData";
import Summary from "./sections/Summary";
import PieChart from "./sections/piechart";
import LineChart from "./sections/linechart";

export default function Homepage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const current =
    new Date().toLocaleString("default", { month: "short" }) +
    " " +
    new Date().getFullYear();

  const previousDate = new Date();
  previousDate.setMonth(previousDate.getMonth() - 1); // Subtract one month
  const previous =
    previousDate.toLocaleString("default", { month: "short" }) +
    " " +
    previousDate.getFullYear();

  const [data, setData] = useState<any>({});
  const [MonthlyIncome, SetMonthlyIncome] = useState<number>(0);
  const [TotalExpenses, setTotalExpenses] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>(current);
  const [expensePercentages, setExpensePercentages] = useState<number[]>([]);
  const [OldExpenses, setOldExpenses] = useState<any>({});
  const [PreviousMonthData, setPreviousMonthData] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>("");

  const months = [
    "Jan 2024",
    "Feb 2024",
    "Mar 2024",
    "Apr 2024",
    "May 2024",
    "Jun 2024",
    "Jul 2024",
    "Aug 2024",
    "Sep 2024",
    "Oct 2024",
    "Nov 2024",
    "Dec 2024",
  ];

  const fetchPercentagesData = async () => {
    try {
      const response = await dispatch(fetchPercentages()).unwrap();
      const monthlyData = Array(12).fill(0);
      response.forEach(
        (monthData: { month: string; ExpensePercentage: string }) => {
          const monthIndex = new Date(monthData.month).getMonth();
          monthlyData[monthIndex] =
            parseFloat(monthData.ExpensePercentage) || 0;
        }
      );
      setExpensePercentages(monthlyData);
    } catch (error) {
      console.error("Failed to fetch expense percentages:", error);
    }
  };

  const fetchExpenseData = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getExpenses()).unwrap();
      const currentMonth = new Date().getMonth();

      const {
        Housing = 0,
        food = 0,
        Transportation = {},
        customExpenses = [],
      } = response[11];
      const customExpensesTotal = customExpenses.reduce(
        (total: number, expense: CustomExpense) =>
          total + (expense.amount || 0),
        0
      );
      const previous = currentMonth - 1;

      setData(response[currentMonth]);
      setPreviousMonthData(response[previous]);
      console.log(PreviousMonthData);

      setTotalExpenses(
        Housing +
          food +
          (Transportation.carPayment || 0) +
          (Transportation.cost || 0) +
          (Transportation.insurance || 0) +
          customExpensesTotal
      );
    } catch (error) {
      setError({
        message: "Unable to load expenses. Please try again later.",
        details: error instanceof Error ? error.message : String(error),
      });
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await dispatch(fetchDetails()).unwrap();
      SetMonthlyIncome(response.monthlyIncome as number);
    } catch {
      alert("Failed to fetch profile details.");
    }
  };
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signup");
    fetchUserDetails();
    fetchPercentagesData();
    fetchExpenseData();
  }, [navigate]);

  const handleMonthChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);

    if (month !== current) {
      try {
        const response = await dispatch(fetchOldExpenses(month)).unwrap();
        if (!response) {
          setOldExpenses({}); // Handle no data case
          alert("No data available for the selected month.");
        } else {
          setOldExpenses(response);
        }
      } catch (error) {
        console.error("Failed to fetch old expenses:", error);
      }
    }
  };

  return (
    <>
      <ErrorBoundary>
        <Navbar />
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="container mx-auto p-8 bg-red-100 text-red-800">
            <h2>Error Loading Data</h2>
            <p>{error.message}</p>
            <button
              onClick={() => {
                setError(null);
                fetchExpenseData();
              }}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="container mx-auto p-8 space-y-12 bg-gray-700 text-gray-100">
            {/* Header Section */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-green-400">
                Financial Overview
              </h1>
            </div>

            {/* Grid Layout for Financial Summary and Pie Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
              {/* Financial Summary Section */}
              <Summary
                MonthlyIncome={MonthlyIncome}
                TotalExpenses={TotalExpenses}
                data={data}
                PreviousMonthData={PreviousMonthData}
                previous={previous}
              />
              {/* Pie Chart Section */}
              <PieChart
                selectedMonth={selectedMonth}
                handleMonthChange={handleMonthChange}
                months={months}
                current={current}
                data={data}
                OldExpenses={OldExpenses}
              />
            </div>

            {/* Line Chart Section for Expense Trends */}
            <LineChart expensePercentages={expensePercentages} />
          </div>
        )}
      </ErrorBoundary>
    </>
  );
}
