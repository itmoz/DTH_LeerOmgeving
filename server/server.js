import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { login, register, getUser, getBalance, addBalance, logout } from "./controllers/authController.js";

const hostname = process.env.HOST_NAME || "127.0.0.1";
const port = process.env.PORT || 3000;
const allowedOrigins = (
  process.env.FRONTEND_ORIGIN ||
  "http://127.0.0.1:5173,http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const server = http.createServer(async (req, res) => {
  // CORS
  const requestOrigin = req.headers.origin;
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // Root test
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Server is running and connected to MongoDB");
  }

  // GET USER
  if (req.method === "GET" && req.url.startsWith("/user")) {
    return getUser(req, res);
  }

  // GET BALANCE
  if (req.method === "GET" && req.url.startsWith("/balance")) {
    return getBalance(req, res);
  }

  // ADD BALANCE
  if (req.method === "POST" && req.url === "/add-balance") {
    return addBalance(req, res);
  }

  // REGISTER
  if (req.method === "POST" && req.url === "/register") {
    return register(req, res);
  }

  // LOGIN
  if (req.method === "POST" && req.url === "/login") {
    return login(req, res);
  }

  // LOGOUT
  if (req.method === "POST" && req.url === "/logout") {
    return logout(req, res);
  }

  // fallback
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});