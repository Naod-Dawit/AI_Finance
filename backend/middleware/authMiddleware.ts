import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomrRequest } from "../types";
import { decode } from "punycode";

dotenv.config();

const authMiddleware = (
  req: CustomrRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    console.error("ACCESS_TOKEN_SECRET is not set in the environment");
    res.status(500).json({ message: "Internal server error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & { id: string };
    console.log(`Decoded payload:`, decoded);

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
