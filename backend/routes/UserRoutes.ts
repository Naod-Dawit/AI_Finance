import express from "express";
import signup from "../controllers/SignUpController";
import signin from "../controllers/SigninController";
import authMiddleware from "../middleware/authMiddleware";
import {  archiveExpensesToNewMonth, fetchOldExpenses, getCurrentMonthExpenses,  updateCurrentMonthExpenses } from "../controllers/ExpensesController";
import updateMonthlyExpense from '../controllers/updateMonthlyController'
import { profileHandler } from "../controllers/ProfileController";
const router = express.Router();




//POST METHODS

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/fetchOldExpenses",authMiddleware,fetchOldExpenses);

//PUT METHODS
// router.post("/expenses", authMiddleware, expensesUpdate);
// router.put("/update",authMiddleware,updateMonthlyExpense)
// router.get("/expenses", authMiddleware, getExpenses);



router.get("/expenses", authMiddleware, getCurrentMonthExpenses);
router.put("/expenses", authMiddleware, updateCurrentMonthExpenses);
//GET METHODS


router.post("/archiveExpenses", async (req, res) => {
    try {
      await archiveExpensesToNewMonth();
      res.status(200).json({ message: "Expenses archived successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to archive expenses", error });
    }
  });
export default router;
router.route("/profile").all(authMiddleware).get(profileHandler).put(profileHandler);
