import React, { useState } from "react";
import ProgressBar from "./progressBar";
import BreakdownTable from "./breakdowntable";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PieChart,
  AlertTriangle,
} from "lucide-react";

type TransportationExpenses = {
  cost?: number;
  carPayment?: number;
  insurance?: number;
};

type CustomExpense = {
  date: any;

  name: string;
  amount: number;
  category: string;
};

type Props = {
  MonthlyIncome: number;
  TotalExpenses: number;
  data: {
    Monthly_saving_Goal: number;
    food?: number;
    Housing?: number;
    Transportation?: TransportationExpenses;
    customExpenses?: CustomExpense[];
    ExpensePercentage?: number;
  };
  PreviousMonthData?: {
    food?: number;
    Housing?: number;
    Transportation?: TransportationExpenses;
    customExpenses?: CustomExpense[];
    ExpensePercentage?: number;
  };
  previous?: string;
};

export default function Summary({
  MonthlyIncome,
  TotalExpenses,
  data,
  PreviousMonthData,
  previous,
}: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const navigate = useNavigate();

  // Safely calculate numeric values with default fallbacks
  const safeNumber = (value?: number) => value || 0;

  // Calculate savings metrics
  const netSavings = MonthlyIncome - TotalExpenses;
  const savingsDifference = netSavings - safeNumber(data.Monthly_saving_Goal);
  const savingsPercentage =
    (netSavings / safeNumber(data.Monthly_saving_Goal)) * 100;

  // Safely calculate transportation expenses
  const calculateTransportationExpenses = (
    transportData?: TransportationExpenses
  ) =>
    safeNumber(transportData?.cost) +
    safeNumber(transportData?.carPayment) +
    safeNumber(transportData?.insurance);

  // Calculate expense changes
  const calculateExpenseChange = (current: number, previous: number) => ({
    amount: Math.abs(current - previous),
    isIncrease: current > previous,
  });

  const expenseChanges = {
    food: calculateExpenseChange(
      safeNumber(data.food),
      safeNumber(PreviousMonthData?.food)
    ),
    housing: calculateExpenseChange(
      safeNumber(data.Housing),
      safeNumber(PreviousMonthData?.Housing)
    ),
    transportation: calculateExpenseChange(
      calculateTransportationExpenses(data.Transportation),
      calculateTransportationExpenses(PreviousMonthData?.Transportation)
    ),
    others: calculateExpenseChange(
      data.customExpenses?.reduce(
        (total, expense) => total + expense.amount,
        0
      ) || 0,
      PreviousMonthData?.customExpenses?.reduce(
        (total, expense) => total + expense.amount,
        0
      ) || 0
    ),
  };

  // Financial health assessment
  const getFinancialHealthStatus = () => {
    if (savingsDifference > 0 && savingsPercentage > 100) return "Excellent";
    if (savingsDifference > 0) return "Good";
    if (savingsDifference === 0) return "Moderate";
    return "Needs Improvement";
  };

  const financialHealthStatus = getFinancialHealthStatus();

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 space-y-6">
      {/* Savings Goal Section */}
      <div className="flex items-center space-x-4">
        <AlertTriangle
          className={`
            ${savingsDifference > 0 ? "text-green-400" : "text-red-400"}
            w-10 h-10
          `}
        />
        <div>
          {savingsDifference > 0 ? (
            <h1 className="text-green-400 text-2xl font-semibold">
              🎉 You're saving an extra ${savingsDifference.toFixed(2)} beyond
              your monthly goal!
            </h1>
          ) : (
            <h1 className="text-red-400 text-2xl font-semibold">
              🚨 You are falling short of your savings goal by $
              {Math.abs(savingsDifference).toFixed(2)}
            </h1>
          )}
          <p className="text-gray-300">
            Financial Health Status:
            <span
              className={`
                ml-2 font-bold
                ${financialHealthStatus === "Excellent" && "text-green-400"}
                ${financialHealthStatus === "Good" && "text-green-300"}
                ${financialHealthStatus === "Moderate" && "text-yellow-400"}
                ${
                  financialHealthStatus === "Needs Improvement" &&
                  "text-red-400"
                }
              `}
            >
              {financialHealthStatus}
            </span>
          </p>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-3 gap-4 text-gray-200">
        <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3">
          <DollarSign className="text-blue-400" />
          <div>
            <p className="font-semibold">Total Income</p>
            <p>${MonthlyIncome.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3">
          <CreditCard className="text-purple-400" />
          <div>
            <p className="font-semibold">Total Expenses</p>
            <p>${TotalExpenses.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-3">
          <PieChart className="text-green-400" />
          <div>
            <p className="font-semibold">Net Savings</p>
            <p>${netSavings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Monthly Comparison */}
      {PreviousMonthData && (
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-4">
            Month-to-Month Expense Trends ({previous})
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-gray-300 mb-2">Expense Changes</h4>
              {Object.entries(expenseChanges).map(([category, change]) => (
                <div key={category} className="flex justify-between mb-2">
                  <span className="capitalize">{category}</span>
                  <span
                    className={`
                      font-bold
                      ${change.isIncrease ? "text-red-400" : "text-green-400"}
                    `}
                  >
                    {change.isIncrease ? (
                      <TrendingUp size={16} className="inline mr-1" />
                    ) : (
                      <TrendingDown size={16} className="inline mr-1" />
                    )}
                    ${change.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="text-gray-300 mb-2">Overall Trend</h4>
              <p>
                Expenses{" "}
                {safeNumber(data.ExpensePercentage) >
                safeNumber(PreviousMonthData.ExpensePercentage)
                  ? "increased"
                  : "decreased"}{" "}
                by{" "}
                <span
                  className={`
                    font-bold 
                    ${
                      safeNumber(data.ExpensePercentage) >
                      safeNumber(PreviousMonthData.ExpensePercentage)
                        ? "text-red-400"
                        : "text-green-400"
                    }
                  `}
                >
                  {Math.abs(
                    ((safeNumber(data.ExpensePercentage) -
                      safeNumber(PreviousMonthData.ExpensePercentage)) /
                      safeNumber(PreviousMonthData.ExpensePercentage)) *
                      100
                  ).toFixed(2)}
                  %
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Budget Utilization and Breakdown */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-200">
            Budget Utilization
          </h3>
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showBreakdown ? "Hide Details" : "View Expense Breakdown"}
          </button>
        </div>
        <ProgressBar total={MonthlyIncome} used={TotalExpenses} />
      </div>

      {/* Detailed Breakdown Modal */}
      {showBreakdown && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-gray-100 w-full max-w-4xl h-full md:h-auto rounded-lg overflow-y-auto p-6 relative">
            <button
              onClick={() => {
                setShowBreakdown(false);
                navigate("/");
              }}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-lg"
            >
              Close
            </button>
            <h2 className="text-2xl font-bold mb-4">
              Detailed Expense Breakdown
            </h2>

            <BreakdownTable
              data={[
                { category: "Housing", amount: safeNumber(data.Housing) },
                { category: "Food", amount: safeNumber(data.food) },
                {
                  category: "Transportation",
                  amount: calculateTransportationExpenses(data.Transportation),
                },
                ...(data.customExpenses || []).map((e: CustomExpense) => ({
                  category: e.name,
                  amount: e.amount,
                  date: e.date ? new Date(e.date).toLocaleDateString() : "N/A",
                })),
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
