import { Request, Response } from "express";
import { User } from "../models/userSchema"; // Ensure this path is correct
import dotenv from "dotenv";
import { CustomRequest } from "../types";

dotenv.config();

export const profileHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized access." });
    return;
  }

  if (req.method === "GET") {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching profile" });
    }
  } else if (req.method === "PUT") {
    const { name, monthlyIncome, amount, creditcard, goal } = req.body;

    try {
      const existingUser = await User.findById(userId);

      if (!existingUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Update fields if provided
      if (name) existingUser.name = name;
      if (monthlyIncome) existingUser.monthlyIncome = monthlyIncome;
      if (amount) existingUser.amount = amount;
      if (creditcard) existingUser.creditcard = creditcard;
      if (goal) existingUser.goal = goal;

      await existingUser.save();
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error updating profile" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
