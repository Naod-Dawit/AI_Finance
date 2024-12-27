import React from "react";
import { Line } from "react-chartjs-2";
import { lineChartOptions } from "../../utils/ChartConfigutation";
import { getLineChartData } from "../../utils/chartData";

type Props = {
  expensePercentages: any;
};

export default function LineChart({ expensePercentages }: Props) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-3xl p-8 border border-gray-700 transition-transform duration-300 hover:scale-105 hover:shadow-blue-600/50">
      <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-wide">
        Expense Trend
      </h2>
      <div className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <Line
          options={lineChartOptions}
          data={getLineChartData(expensePercentages)}
        />
      </div>
    </div>
  );
}
