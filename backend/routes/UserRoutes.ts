import express from "express";
import signup from "../controllers/SignUpController";
import signin from "../controllers/SigninController";
import authMiddleware from "../middleware/authMiddleware";
import { fetchProfile, updateProfile } from "../controllers/ProfileController";
import { expensesUpdate, getExpenses } from "../controllers/ExpensesController";
import updateMonthlyExpense from '../controllers/updateMonthlyController'
const router = express.Router();




//POST METHODS

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/expenses", authMiddleware, expensesUpdate);

//PUT METHODS
router.put("/profile", authMiddleware, updateProfile);
router.put("/update",authMiddleware,updateMonthlyExpense)
//GET METHODS
router.get("/profile", authMiddleware, fetchProfile);
router.get("/expenses", authMiddleware, getExpenses);

export default router;
