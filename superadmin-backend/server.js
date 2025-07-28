import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("<h1>Your API is working</h1>");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
