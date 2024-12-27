export const getActiveExpenseData = (expenseData: {
  food?: number;
  Housing?: number;
  Transportation?: {
    carPayment?: number;
    cost?: number;
    insurance?: number;
  };
  customExpenses?: { name: string; amount: number }[];
}) => {
  const defaultLabels = ["Food", "Housing", "Transportation"];
  const defaultData = [
    expenseData.food || 0,
    expenseData.Housing || 0,
    (expenseData.Transportation?.carPayment || 0) +
      (expenseData.Transportation?.cost || 0) +
      (expenseData.Transportation?.insurance || 0),
  ];

  // Add custom expenses if present
  const customLabels =
    expenseData.customExpenses?.map((expense) => expense.name) || [];
  const customData =
    expenseData.customExpenses?.map((expense) => expense.amount) || [];

  // Combine default and custom data
  const labels = [...defaultLabels, ...customLabels];
  const data = [...defaultData, ...customData];

  return {
    labels,
    datasets: [
      {
        data,
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


export const getLineChartData = (expensePercentages: number[]) => ({
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
});
