import { Response } from "express";
import { CustomRequest } from "../types";
import Expenses from "../models/expensesSchema";
import moment from "moment";
import { User } from "../models/userSchema";
import cron from "node-cron";

export const updateCurrentMonthExpenses = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized access." });
    return;
  }

  const currentMonth = moment().format("MMM YYYY");

  try {
    const {
      Housing,
      Transportation,
      Monthly_saving_Goal,
      food,
      customExpenses,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const totalExpenses =
      Housing +
      (Transportation.carPayment || 0) +
      (Transportation.insurance || 0) +
      (Transportation.cost || 0) +
      food +
      customExpenses.reduce(
        (sum: number, expense: any) => sum + expense.amount,
        0
      );

    const ExpensePercentage =
      user.monthlyIncome > 0
        ? ((totalExpenses / user.monthlyIncome) * 100).toFixed(2)
        : "0";

    const customExpensesWithDate = customExpenses.map((expense: any) => ({
      ...expense,
      id:expense.id,
      name: expense.name,
      date: new Date(), // Add current date to each expense
    }));
    // More precise update method
    const updatedExpenses = await Expenses.findOneAndUpdate(
      {
        monthlyExpenses: {
          $elemMatch: { month: currentMonth, userId },
        },
      },
      {
        $set: {
          "monthlyExpenses.$": {
            userId,
            month: currentMonth,
            Housing,
            Transportation,
            Monthly_saving_Goal,
            food,
            customExpenses: customExpensesWithDate,
            ExpensePercentage,
          },
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (updatedExpenses) {
      res.status(200).json(updatedExpenses);
      return;
    }

    // Fallback error handling
    res.status(500).json({ message: "Failed to update expenses" });
  } catch (err: any) {
    console.error("Error:", err.message);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

export const getCurrentMonthExpenses = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const currentMonth = moment().format("MMM YYYY");

    const userId = req.user?.id;

    const expenses = await Expenses.findOne({
      "monthlyExpenses.userId": userId,
      "monthlyExpenses.month": currentMonth,
    });

    if (!expenses) {
      return res.status(404).json({ message: "Expenses not found" });
    }

    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching expenses", error });
  }
};

export const fetchOldExpenses = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { monthdata } = req.body;

    // Use $elemMatch to find only the monthly expense that matches the month and userId
    const expenses = await Expenses.findOne(
      {
        monthlyExpenses: {
          $elemMatch: { month: monthdata, userId: userId },
        },
      },
      { "monthlyExpenses.$": 1 } // Only return the matched month entry
    );

    if (
      !expenses ||
      !expenses.monthlyExpenses ||
      expenses.monthlyExpenses.length === 0
    ) {
      return res
        .status(404)
        .json({ message: "Expenses for this month not found" });
    }

    return res.status(200).json(expenses.monthlyExpenses[0]); // Send only the specific month entry
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const archiveExpensesToNewMonth = async () => {
  const today = moment();
  const currentMonth = today.format("MMM YYYY");
  const previousMonth = today.subtract(1, "month").format("MMM YYYY");

  try {
    const expenses = await Expenses.find({
      "monthlyExpenses.month": previousMonth,
    });

    for (const expense of expenses) {
      const lastMonthData = expense.monthlyExpenses.find(
        (entry: any) => entry.month === previousMonth
      );

      if (lastMonthData) {
        // Add a new entry for the current month
        expense.monthlyExpenses.push({
          userId: lastMonthData.userId,
          month: currentMonth,
          Housing: 0,
          Transportation: {},
          Monthly_saving_Goal: 0,
          food: 0,
          customExpenses: [],
          ExpensePercentage: "0",
        });

        // Save updated document
        await expense.save();
      }
    }

    console.log("Expenses archived for the new month!");
  } catch (error) {
    console.error("Error archiving expenses:", error);
  }
};

// Schedule job: Runs at midnight on the 1st of each month
cron.schedule("0 0 1 * *", archiveExpensesToNewMonth);
