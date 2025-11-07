const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const requireAuth = require("./middleware/requireAuth");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = process.env.PORT || 4000;

// ✅ SIMPLE but reliable CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-todo-2sa4.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Force CORS headers for all responses (extra layer)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    "http://localhost:5173",
    "https://mern-todo-2sa4.vercel.app",
  ];
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

// ✅ Handle preflight (important)
app.options("*", (req, res) => {
  res.sendStatus(200);
});

// ✅ Body parser
app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => res.send("Server is running ✅"));
app.use("/api/todos", requireAuth, todoRoutes);
app.use("/api/user", userRoutes);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => console.error("❌ MongoDB failed:", err.message));
