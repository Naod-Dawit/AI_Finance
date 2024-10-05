import { Request, Response } from "express";
import { User } from "../models/userSchema"; // Ensure this path is correct
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signup = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create a new user
    const newUser = new User({
      email,
      password,
      username,
      name: "",
      monthlyIncome: 0,
      amount: 0,
      creditcard: 0,
      goal: "",
    });
    await newUser.save();

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, secret, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
    return;
  }
};
