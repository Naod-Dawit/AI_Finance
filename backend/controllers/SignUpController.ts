import { Request, Response } from "express";
import { User } from "../models/userSchema"; // Ensure this path is correct
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const signup = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    const baseSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!baseSecret) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
    }

    const secret = baseSecret + newUser._id;

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, secret);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
};

export default signup;
