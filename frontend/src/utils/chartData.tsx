export const getActiveExpenseData = (expenseData: any) => ({
  labels: [
    "Food",
    "Housing",
    "Transportation",
    ...(expenseData.customExpenses?.map((e: { name: any }) => e.name) || []),
  ],
  datasets: [
    {
      data: [
        expenseData.food || 0,
        expenseData.Housing || 0,
        (expenseData.Transportation?.carPayment || 0) +
          (expenseData.Transportation?.cost || 0) +
          (expenseData.Transportation?.insurance || 0),
        ...(expenseData.customExpenses?.map((e: { amount: any }) => e.amount) ||
          []),
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
});

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
