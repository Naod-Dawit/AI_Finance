import express from "express";
import dotenv from "dotenv";
import { signup } from "./controllers/SignUpController";
import { ConnectDb } from "./utils/db";
import cors from 'cors'
import { signin } from "./controllers/SigninController";
import { updateProfile } from "./controllers/ProfileController";
import { authenticateJWT } from "./utils/authMiddleware";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors())

// Database connection
ConnectDb();

// Routes
app.post("/api/signup", signup);
app.post('/api/signin',signin);
app.post('/api/profile',authenticateJWT,updateProfile)

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
