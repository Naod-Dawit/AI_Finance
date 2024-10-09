import express from "express";
import dotenv from "dotenv";
import { ConnectDb } from "./utils/db";
import cors from "cors";
import UserRoutes from './routes/UserRoutes'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Database connection
ConnectDb();

// Routes


app.use('/api',UserRoutes)

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
