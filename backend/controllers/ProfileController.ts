import { Request, Response } from "express";
import { User } from "../models/userSchema"; // Ensure this path is correct
import dotenv from "dotenv";
import { CustomrRequest } from "../types";

dotenv.config();

export const updateProfile = async (
  req: CustomrRequest,
  res: Response
): Promise<void> => {
  const user = req.user!;
  console.log(user);
  
  if (!user) {
    res.status(401).json({ message: "Unauthorized access." });
    return;
  }

  const { name, monthlyIncome, amount, creditcard, goal } = req.body;

  try {
    const existingUser = await User.findById(user);

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    existingUser.name = name;
    existingUser.monthlyIncome = monthlyIncome;
    existingUser.amount = amount;
    existingUser.creditcard = creditcard;
    existingUser.goal = goal;

    await existingUser.save();

    res.status(200).json({ message: "Profile updated successfully" });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
    return;
  }
};
