export const pieChartOptions = {
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
  export const lineChartOptions = {
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
