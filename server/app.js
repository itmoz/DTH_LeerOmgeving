// server/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  login,
  register,
  getUser,
  logout,
  getBalance  
} from "./controllers/authController.js";

const app = express();

// 1. Body + cookies
app.use(express.json());
app.use(cookieParser());

// 2. CORS vóór je routes
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // origin kan null zijn bij bv. Postman → dan gewoon toelaten
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);

// Preflight (OPTIONS) ook afhandelen
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

// 3. Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/login", login);
app.post("/register", register);
app.get("/user", getUser);
app.post("/logout", logout);
app.get("/balance", getBalance);

export default app;