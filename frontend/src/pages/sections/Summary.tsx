import React, { useState } from "react";
import ProgressBar from "./progressBar";
import BreakdownTable from "./breakdowntable";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Props = {
  MonthlyIncome: number;
  TotalExpenses: number;
  data: any;
  PreviousMonthData: any;
  previous: string;
};

export default function Summary({
  MonthlyIncome,
  TotalExpenses,
  data,
  PreviousMonthData,
  previous,
}: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const navigate=useNavigate()
  return (
    <>
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
        
        <span className="space-y-3 text-2xl">
          <h3>Budget Utilization</h3>
          <ProgressBar total={MonthlyIncome} used={TotalExpenses} />
        </span>
        <br />
        {MonthlyIncome - TotalExpenses - data.Monthly_saving_Goal >
        data.Monthly_saving_Goal ? (
          <h1 className="text-green-400 text-2xl font-semibold">
            🎉 You're saving an extra $
            {(MonthlyIncome - TotalExpenses - data.Monthly_saving_Goal).toFixed(
              2
            )}{" "}
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
        <h2 className="text-xl font-semibold text-gray-200">Expense Summary</h2>
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
                <h4 className="text-gray-200 font-semibold mb-2">Changes</h4>
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
                      {Math.abs(data.food - PreviousMonthData.food).toFixed(2)}
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
                      {data.Housing - PreviousMonthData.Housing > 0 ? "↑" : "↓"}{" "}
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
                    data.ExpensePercentage > PreviousMonthData.ExpensePercentage
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
                {data.ExpensePercentage > PreviousMonthData.ExpensePercentage
                  ? "increase"
                  : "decrease"}{" "}
                in expenses compared to last month.
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {showBreakdown ? "Hide Breakdown Table" : "Show all Expenses"}
        </button>

        {showBreakdown && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-gray-100 w-full max-w-4xl h-full md:h-auto rounded-lg overflow-y-auto p-4 relative">
              <button
                onClick={() => {
                  setShowBreakdown(false);
                  navigate("/"); // Navigate to the homepage
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
                  { category: "Housing", amount: data?.Housing || 0 },
                  { category: "Food", amount: data?.food || 0 },
                  {
                    category: "Transportation",
                    amount:
                      (data?.Transportation?.cost || 0) +
                      (data?.Transportation?.insurance || 0),
                  },
                  ...(data?.customExpenses || []).map(
                    (e: { name: string; amount: number }) => ({
                      category: e.name,
                      amount: e.amount,
                    })
                  ),
                ]}
              />
            
            </div>
          </div>
        )}
      </div>
    </>
  );
}
