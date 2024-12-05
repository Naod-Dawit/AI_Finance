import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomRequest } from "../types";
import { decode } from "punycode";

dotenv.config();

const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }
  try {
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ message: "Invalid token. Unauthorized access." });
    }

    const baseSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!baseSecret) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
    }
    const secret = baseSecret + decoded.id;

    const verified = jwt.verify(token, secret) as JwtPayload & { id: string };

    req.user = { id: verified.id, email: verified.email };
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;
