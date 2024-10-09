import { NextFunction, Request, Response } from "express";
import { User } from "../models/userSchema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      alert("User not found");
      res
        .status(400)
        .json({ message: "Invalid email or password. Please try again." });
      return;
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      res
        .status(400)
        .json({ message: "Invalid email or password. Please try again." });
      return;
    }

    const baseSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!baseSecret) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
    }

    const secret = baseSecret + user._id;
    const token = jwt.sign({ id: user._id, email: user.email }, secret);

    res.status(201).json({ token });
    console.error("Sign in Successful");
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
    return;
  }
};

export default signin;
