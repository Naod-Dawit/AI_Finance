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
import LoadingSpinner from '../assets/Loading'
import ErrorBoundary from "../assets/ErrorBoundary";


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
  const [error,setError]=useState<any>('')

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
        details: error instanceof Error ? error.message : String(error)
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

  const getActiveExpenseData = () => {
    const expenseData = selectedMonth === current ? data : OldExpenses;
    return {
      labels: [
        "Food",
        "Housing",
        "Transportation",
        ...(expenseData.customExpenses?.map((e: { name: any }) => e.name) ||
          []),
      ],
      datasets: [
        {
          data: [
            expenseData.food || 0,
            expenseData.Housing || 0,
            (expenseData.Transportation?.carPayment || 0) +
              (expenseData.Transportation?.cost || 0) +
              (expenseData.Transportation?.insurance || 0),
            ...(expenseData.customExpenses?.map(
              (e: { amount: any }) => e.amount
            ) || []),
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
  };

  const pieChartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: { raw: any }) {
            const value = tooltipItem.raw;
            return `Amount: $${value.toFixed(2)}`;
          },
        },
      },
    },
  };
  const lineChartOptions = {
    animations: {
      radius: {
        duration: 400,
        easing: "linear",
        loop: (context: any) => context.active,
      },
    },
    hoverRadius: 10, // Radius of the point when hovered
    hoverBackgroundColor: "red",
    interaction: {
      mode: "nearest" as const, // Ensure this is typed correctly
      intersect: true,
      axis: "x",
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: { raw: any; }) {
            const value = tooltipItem.raw; // Access data value
            return `Expense Percentage: ${value}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return `${value}%`;
          },
        },
      },
    },
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
        data: expensePercentages,

        borderColor: "#36A2EB",
        tension: 0.3,
        fill: false,
      },
    ],
  };

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
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
            {MonthlyIncome - TotalExpenses - data.Monthly_saving_Goal >
            data.Monthly_saving_Goal ? (
              <h1 className="text-green-400 text-2xl font-semibold">
                🎉 You're saving an extra $
                {(
                  MonthlyIncome -
                  TotalExpenses -
                  data.Monthly_saving_Goal
                ).toFixed(2)}{" "}
                beyond your monthly goal!
              </h1>
            ) : (
              <h1 className="text-red-400 text-2xl font-semibold">
                🚨 You are falling short of your savings goal by $
                {Math.abs(
                  MonthlyIncome - TotalExpenses - data.Monthly_saving_Goal
                ).toFixed(2)}
                . Try reducing your expenses to meet your goal!
              </h1>
            )}
            <h2 className="text-xl font-semibold text-gray-200">
              Expense Summary
            </h2>
            <p>Total Monthly Income: ${MonthlyIncome.toFixed(2)}</p>
            <p>Total Expenses: ${TotalExpenses.toFixed(2)}</p>
            <p>Net Savings: ${(MonthlyIncome - TotalExpenses).toFixed(2)}</p>
            {/*Comparion section */}
            {PreviousMonthData && (
              <div className="mt-4 bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  Comparison with Last Month ({previous})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Last Month's Expenses Section */}

                  {/* Expense Changes Section */}
                  <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                    <h4 className="text-gray-200 font-semibold mb-2">
                      Changes
                    </h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center">
                        Food:
                        <span
                          className={`ml-2 font-bold ${
                            data.food - PreviousMonthData.food > 0
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {data.food - PreviousMonthData.food > 0 ? "↑" : "↓"} $
                          {Math.abs(data.food - PreviousMonthData.food).toFixed(
                            2
                          )}
                        </span>
                      </li>
                      <li className="flex items-center">
                        Housing:
                        <span
                          className={`ml-2 font-bold ${
                            data.Housing - PreviousMonthData.Housing > 0
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {data.Housing - PreviousMonthData.Housing > 0
                            ? "↑"
                            : "↓"}{" "}
                          $
                          {Math.abs(
                            data.Housing - PreviousMonthData.Housing
                          ).toFixed(2)}
                        </span>
                      </li>
                      <li className="flex items-center">
                        Transportation:
                        <span
                          className={`ml-2 font-bold ${
                            data.Transportation?.cost +
                              data.Transportation?.carPayment +
                              data.Transportation?.insurance -
                              (PreviousMonthData.Transportation?.cost +
                                PreviousMonthData.Transportation?.carPayment +
                                PreviousMonthData.Transportation?.insurance) >
                            0
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {data.Transportation?.cost +
                            data.Transportation?.carPayment +
                            data.Transportation?.insurance -
                            (PreviousMonthData.Transportation?.cost +
                              PreviousMonthData.Transportation?.carPayment +
                              PreviousMonthData.Transportation?.insurance) >
                          0
                            ? "↑"
                            : "↓"}{" "}
                          $
                          {Math.abs(
                            data.Transportation?.cost +
                              data.Transportation?.carPayment +
                              data.Transportation?.insurance -
                              (PreviousMonthData.Transportation?.cost +
                                PreviousMonthData.Transportation?.carPayment +
                                PreviousMonthData.Transportation?.insurance)
                          ).toFixed(2)}
                        </span>
                      </li>
                      <li className="flex items-center">
                        Others:
                        <span
                          className={`ml-2 font-bold ${
                            (data.customExpenses?.reduce(
                              (total: any, expense: { amount: any }) =>
                                total + (expense.amount || 0),
                              0
                            ) || 0) -
                              (PreviousMonthData.customExpenses?.reduce(
                                (total: any, expense: { amount: any }) =>
                                  total + (expense.amount || 0),
                                0
                              ) || 0) >
                            0
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {(data.customExpenses?.reduce(
                            (total: any, expense: { amount: any }) =>
                              total + (expense.amount || 0),
                            0
                          ) || 0) -
                            (PreviousMonthData.customExpenses?.reduce(
                              (total: any, expense: { amount: any }) =>
                                total + (expense.amount || 0),
                              0
                            ) || 0) >
                          0
                            ? "↑"
                            : "↓"}{" "}
                          $
                          {Math.abs(
                            (data.customExpenses?.reduce(
                              (total: any, expense: { amount: any }) =>
                                total + (expense.amount || 0),
                              0
                            ) || 0) -
                              (PreviousMonthData.customExpenses?.reduce(
                                (total: any, expense: { amount: any }) =>
                                  total + (expense.amount || 0),
                                0
                              ) || 0)
                          ).toFixed(2)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Monthly Comparison Summary */}
                <div className="mt-4 bg-gray-800 p-4 rounded-lg text-gray-300">
                  <p>
                    This month shows a{" "}
                    <span
                      className={`font-bold ${
                        data.ExpensePercentage >
                        PreviousMonthData.ExpensePercentage
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {Math.abs(
                        ((data.ExpensePercentage -
                          PreviousMonthData.ExpensePercentage) /
                          PreviousMonthData.ExpensePercentage) *
                          100
                      ).toFixed(2)}
                      %
                    </span>{" "}
                    {data.ExpensePercentage >
                    PreviousMonthData.ExpensePercentage
                      ? "increase"
                      : "decrease"}{" "}
                    in expenses compared to last month.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pie Chart Section */}
          <div className="bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
            <select
              id="month-select"
              aria-label="Select Month for Expense Details"

              value={selectedMonth}
              onChange={handleMonthChange}
              className="w-1/2 md:w-1/4 lg:w-1/6 p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <h2 className="text-center text-xl font-semibold text-gray-200">
              Expense Distribution
              <p className="text-gray-400 text-lg text-center">
                {selectedMonth === current
                  ? "Current Month's Expenses"
                  : `Expenses for ${selectedMonth}`}
              </p>
            </h2>
            <div className="relative w-full sm:w-3/4 mx-auto">
              <Doughnut
                data={getActiveExpenseData()}
                options={pieChartOptions}
              />
            </div>
          </div>
        </div>

        {/* Line Chart Section for Expense Trends */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Expense Trend
          </h2>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    )}
    </ErrorBoundary>
    </>
  );
}
