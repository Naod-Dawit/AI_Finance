import express from "express";
import signup from "../controllers/SignUpController";
import signin from "../controllers/SigninController";
import authMiddleware from "../middleware/authMiddleware";
import { fetchProfile, updateProfile } from "../controllers/ProfileController";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.put("/profile", authMiddleware, updateProfile);
router.get('/profile',authMiddleware,fetchProfile)

export default router;
