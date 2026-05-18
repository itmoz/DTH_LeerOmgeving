// server/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  login,
  register,
  getUser,
  logout,
  getBalance,
} from "./controllers/authController.js";

const app = express();

// JSON body & cookies
app.use(express.json());
app.use(cookieParser());

// CORS-config
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
};


app.use(cors(corsOptions));


// Health check route (no DB)
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Test-route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Auth routes
app.post("/login", login);
app.post("/register", register);
app.get("/user", getUser);
app.post("/logout", logout);
app.get("/balance", getBalance);


// Global error handler (always last)
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal server error", details: err?.message || err });
});

export default app;