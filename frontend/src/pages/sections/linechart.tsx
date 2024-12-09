import React from "react";
import { Line } from "react-chartjs-2";
import { lineChartOptions } from "../../utils/ChartConfigutation";
import { getLineChartData } from "../../utils/chartData";

type Props={
    expensePercentages:any

}
export default function LineChart({expensePercentages}:Props) {
  return (
    <div className="bg-gray-100 shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">
        Expense Trend
      </h2>
      <Line
        options={lineChartOptions} data={getLineChartData(expensePercentages)}
      />
    </div>
  );
}
