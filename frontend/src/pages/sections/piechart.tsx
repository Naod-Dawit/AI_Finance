import React from "react";
import { Doughnut } from "react-chartjs-2";
import { pieChartOptions } from "../../utils/ChartConfigutation";
import { getActiveExpenseData } from "../../utils/chartData";

interface Props {
  selectedMonth: any;
  handleMonthChange: any;
  months: any;
  current: any;
  data: any;
  OldExpenses: any;
}
export default function piechart({
  selectedMonth,
  handleMonthChange,
  months,
  current,
  data,
  OldExpenses,
}: Props) {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
      <select
        id="month-select"
        aria-label="Select Month for Expense Details"
        value={selectedMonth}
        onChange={handleMonthChange}
        className="w-1/2 md:w-1/4 lg:w-1/6 p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        {months.map((month: any, index: any) => (
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
          data={getActiveExpenseData(
            selectedMonth === current ? data : OldExpenses
          )}
          options={pieChartOptions}
        />
      </div>
    </div>
  );
}
