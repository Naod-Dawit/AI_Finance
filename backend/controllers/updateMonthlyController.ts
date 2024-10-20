import { Response } from "express";
import { CustomRequest } from "../types";
import Expenses from "../models/expensesSchema";
import moment from "moment";
import { User } from "../models/userSchema";

// Function to recalculate the expense percentage based on monthly income
const calculateExpensePercentage = (totalExpenses: number, income: number): number => {
  return income > 0 ? (totalExpenses / income) * 100 : 0;
};

// Function to calculate total expenses including custom expenses
const calculateTotalExpenses = (body: any): number => {
  const { rent, car_Payment, Monthly_saving, food, others, customExpenses } = body;

  const customExpensesTotal = customExpenses.reduce(
    (total: number, expense: any) => total + expense.amount,
    0
  );

  return rent + car_Payment + Monthly_saving + food + others + customExpensesTotal;
};

// Update expenses when they are added/modified/removed
const  updateMonthlyExpenses = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const currentMonth = moment().format("MMM YYYY");

    const { rent, car_Payment, Monthly_saving, food, others, customExpenses } = req.body;

    let expenses = await Expenses.findOne({ userId });

    if (!expenses) {
      return res.status(404).json({ message: "No expenses found to update." });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const monthlyIncome = user.monthlyIncome || 0;

    // Calculate the new total expenses
    const totalExpenses = calculateTotalExpenses(req.body);

    // Recalculate the percentage
    const ExpensePercentage = calculateExpensePercentage(totalExpenses, monthlyIncome);

    // Check if there is already an entry for the current month
    const monthIndex = expenses.monthlyExpenses.findIndex(
      (exp) => exp.month === currentMonth
    );

    const monthData = {
      month: currentMonth,
      userId,
      rent,
      car_Payment,
      Monthly_saving,
      food,
      others,
      customExpenses,
      ExpensePercentage,
    };

    if (monthIndex >= 0) {
      // If the entry for the current month exists, update it
    //   expenses.monthlyExpenses[monthIndex] = monthData;
    } else {
      // If no entry exists, add the new month's data
      expenses.monthlyExpenses.push(monthData);
    }

    await expenses.save();

    return res.status(200).json({ message: "Expenses updated successfully", expenses });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};




export default updateMonthlyExpenses