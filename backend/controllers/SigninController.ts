import { NextFunction, Request, Response } from "express";
import { User } from "../models/userSchema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

export const signin = async (req: Request, res: Response,next:NextFunction):Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      alert("User not found");
       res
        .status(400)
        .json({ message: "Invalid email or password. Please try again." });
        return
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      console.log("Password does not match");
       res
        .status(400)
        .json({ message: "Invalid email or password. Please try again." });
        return
    }

    // Generate JWT
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
    }
    const token = jwt.sign({ email: user.email }, secret);

    res.status(201).json({ token });
    console.error("Sign in Successful");
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
    return;
  }
};
