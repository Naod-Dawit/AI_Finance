import { Response } from "express";
import { CustomRequest } from "../types";
import Expenses from "../models/expensesSchema";
import moment from "moment";
import { User } from "../models/userSchema";

export const expensesUpdate = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const currentMonth = moment().format("MMM YYYY");

    const { rent, car_Payment, Monthly_saving, food, others, customExpenses } =
      req.body;

    let expenses = await Expenses.findOne({ userId });

    if (!expenses) {
      expenses = new Expenses({ userId, monthlyExpenses: [] });
    }

    // Calculate total expenses
    const totalExpenses =
      rent +
      car_Payment +
      Monthly_saving +
      food +
      others +
      customExpenses.reduce(
        (total: number, expense: any) => total + expense.amount,
        0
      );

    // Fetch monthly income from the User model
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const monthlySalary = user.monthlyIncome || 0;

    // Calculate Expense Percentage correctly
    const ExpensePercentage =
      monthlySalary > 0 ? (monthlySalary / totalExpenses) * 100 : 0;
      
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

    // Add the month's data to the monthly expenses array
    expenses.monthlyExpenses.push(monthData);
    await expenses.save();

    return res.status(200).json(expenses);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export const getExpenses = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;

    const expenses = await Expenses.findOne({
      "monthlyExpenses.userId": userId,
    });

    if (!expenses) {
      return res.status(404).json({ message: "Expenses not found" });
    }

    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching expenses", error });
  }
};
