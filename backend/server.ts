import express from "express";
import dotenv from "dotenv";
import { ConnectDb } from "./utils/db";
import cors from "cors";
import UserRoutes from './routes/UserRoutes'
import { archiveExpensesToNewMonth } from "./controllers/ExpensesController";
dotenv.config();
import cron from "node-cron";


const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Database connection
ConnectDb();

// Routes


app.use('/api',UserRoutes)

cron.schedule("0 0 1 * *", archiveExpensesToNewMonth);


app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
