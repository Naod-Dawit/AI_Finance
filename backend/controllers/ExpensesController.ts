import { Request, Response } from "express";
import { CustomRequest } from "../types";
import Expenses from "../models/expensesSchema";

export const expensesUpdate = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;

    const { rent, car_Payment, Monthly_saving, food, others, customExpenses } =req.body;

    const expenses = new Expenses({
      userId,
      rent,
      car_Payment,
      Monthly_saving,
      food,
      others,
      customExpenses,
    });
    await expenses.save();
    return res.status(200).json(expenses);
  } catch (err: any) {
    console.log(err);
    return { message: `Error ${err.message}` };
  }
};

export const getExpenses = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const expenses = await Expenses.findOne({ userId });

    if (!expenses) {
      return res.status(404).json({ message: "Expenses not found" });
    }
    await expenses.save();

    return res.status(200).json(expenses);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching expenses", error });
  }
};
