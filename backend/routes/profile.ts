import express from "express";
import { updateProfile } from "../controllers/ProfileController";
import authMiddleware from "../middleware/authMiddleware"; 

const router = express.Router();

router.post("/api/profile", authMiddleware, updateProfile);

export default router;
