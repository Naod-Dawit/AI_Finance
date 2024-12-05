import { Response } from "express";
import { CustomRequest } from "../types";
import Expenses from "../models/expensesSchema";
import moment from "moment";
import { User } from "../models/userSchema";

// Function to recalculate the expense percentage based on monthly income
const calculateTotalExpenses = ({
  Housing,
  Transportation,
  food,
  customExpenses,
}: any): number => {
  const customTotal = customExpenses.reduce(
    (sum: number, expense: any) => sum + expense.amount,
    0
  );
  let ExpenseTransportation =
    Transportation.carPayment + Transportation.insurance + Transportation.cost;

  return Housing + ExpenseTransportation + food + customTotal;
};

const calculateExpensePercentage = (total: number, income: number): number => {
  return income > 0 ? (total / income) * 100 : 0;
};

// Update expenses when they are added/modified/removed
const updateMonthlyExpenses = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing." });
    }

    const currentMonth = moment().format("MMM YYYY");

    const {
      Housing,
      Transportation,
      Monthly_saving_Goal,
      food,
      customExpenses,
    } = req.body;

    // Find existing expenses for the user
    // let expenses = await Expenses.findOne({ userId });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const totalExpenses = calculateTotalExpenses(req.body);

    const ExpensePercentage = calculateExpensePercentage(
      totalExpenses,
      user.monthlyIncome || 0
    ).toFixed(2);

    const monthData = {
      userId,
      month: currentMonth,
      Housing,
      Transportation,
      Monthly_saving_Goal,
      food,
      customExpenses,
      ExpensePercentage,
    };

    await Expenses.updateOne(
      {
        "monthlyExpenses.userId": userId,
        "monthlyExpenses.month": currentMonth,
      },
      {
        $set: {
          "monthlyExpenses.$": monthData,
        },
      },
      {
        upsert: true,
        arrayFilters: [
          {
            "elem.userId": userId,
            "elem.month": currentMonth,
          },
        ],
      }
    );
   console.log(userId)

    res.status(200).json({ message: "Expenses updated successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: `Error: ${err.message}` });
  }
};

export default updateMonthlyExpenses;
