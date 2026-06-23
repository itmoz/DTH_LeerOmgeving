import { login, register, getUser, getBalance, addBalance, logout } from "./controllers/authController.js";

export function createRequestHandler(allowedOrigins) {
  return async function handleRequest(req, res) {
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

    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("Server is running and connected to MongoDB");
    }

    if (req.method === "GET" && req.url.startsWith("/user")) {
      return getUser(req, res);
    }

    if (req.method === "GET" && req.url.startsWith("/balance")) {
      return getBalance(req, res);
    }

    if (req.method === "POST" && req.url === "/add-balance") {
      return addBalance(req, res);
    }

    if (req.method === "POST" && req.url === "/register") {
      return register(req, res);
    }

    if (req.method === "POST" && req.url === "/login") {
      return login(req, res);
    }

    if (req.method === "POST" && req.url === "/logout") {
      return logout(req, res);
    }

    res.writeHead(404);
    res.end("Not Found");
  };
}
