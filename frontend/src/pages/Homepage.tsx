import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import { ExpenseDetails, getExpenses } from "../features/auth/expensesSlice";
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
import EditExpenses from "./EditExpenses";
import { fetchDetails } from "../features/auth/authSlice";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signup");
    }

    const fetchMontlyIncome = () =>
      dispatch(fetchDetails()).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          SetMonthlyIncome(response.payload.monthlyIncome as number);
        } else {
          alert("Failed to fetch profile details.");
        }
      });

    const fetchExpenses = async () => {
      try {
        const response: any = await dispatch(getExpenses()).unwrap();
        setTotalExpenses(
          data.food +
            data.car_Payment +
            data.rent +
            data.customExpenses.reduce((total, expense) => {
              return total + expense.amount;
            }, 0)
        );
        setData(response);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      }
    };

    fetchMontlyIncome();
    fetchExpenses();
  }, [dispatch, navigate]);

  const pieChartData = {
    labels: [
      "Monthly Saving",
      "Food",
      "Rent",
      ...(data.customExpenses?.map((expense) => expense.name) || []),
    ],
    datasets: [
      {
        data: [
          data.Monthly_saving || 0,
          data.food || 0,
          data.rent || 0,
          ...(data.customExpenses?.map((expense) => expense.amount) || []),
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
        ],
      },
    ],
  };
  enum Months {
    Jan = 1,
    Feb,
    Mar,
    Apr,
    May,
    June,
    July,
    Aug,
    Sep,
    Oct,
    Nov,
    Dec,
  }

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
        fill: false,
        borderColor: "#36A2EB",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Expense Distribution",
      },
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Financial Overview</h1>
        <p className="text-gray-600">
          Manage your expenses and savings effectively.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Expense Summary</h2>
          <p>Total Monthly Income: ${MonthlyIncome.toFixed(2)}</p>
          <p>
            Total Expenses: $
            {(data.food + data.rent + TotalExpenses).toFixed(2)}
          </p>
          <p>
            Net Savings: ${(MonthlyIncome - data.Monthly_saving).toFixed(2)}
          </p>
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Expense Distribution</h2>
          <Pie data={pieChartData} options={chartOptions} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Expense Trend</h2>
        <Line data={lineChartData} options={chartOptions} />
      </div>

      <button
        onClick={() => setShowEdit(!showEdit)}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        {showEdit ? "Close Edit" : "⚙ Edit Expenses"}
      </button>

      {showEdit && <EditExpenses />}
    </div>
  );
}
