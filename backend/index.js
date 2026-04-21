import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connect_db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

// 🔥 CONNECT KE DATABASE
connectDB();

// routes
app.use("/api/users", userRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});