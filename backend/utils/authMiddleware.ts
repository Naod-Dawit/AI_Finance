import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomrRequest } from "../types";

dotenv.config();

export const authenticateJWT = (
  req: CustomrRequest,
  res: Response,
  next: NextFunction
): any => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  const secret = process.env.ACCESS_TOKEN_SECRET || "";
  
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.sendStatus(403);
    }
    
    if (decoded && typeof decoded === "object" && "user" in decoded) {
      req.user = decoded as { user: string };  // Cast the payload to the expected type
      next();
    } else {
      return res.status(400).json({ message: "Invalid token structure." });
    }
  });
};