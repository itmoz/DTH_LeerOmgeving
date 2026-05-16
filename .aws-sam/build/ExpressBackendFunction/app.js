import express from "express";
import dotenv from "dotenv";

import {
  login,
  register,
  getUser,
  getBalance,
  addBalance,
  logout
} from "./controllers/authController.js";

if (process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
  dotenv.config();
}

const app = express();

app.use(express.json());

const allowedOrigins = (
  process.env.FRONTEND_ORIGIN ||
  "http://127.0.0.1:5173,http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// CORS middleware
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/user", getUser);

app.get("/balance", getBalance);

app.post("/add-balance", addBalance);

app.post("/register", register);

app.post("/login", login);

app.post("/logout", logout);

export default app;