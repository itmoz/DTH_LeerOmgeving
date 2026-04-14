import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { connectDB } from "./database.js";
import { parseBody } from "./utils.js";
import { login, register } from "./controllers/authController.js";

const hostname = process.env.HOST_NAME;
const port = process.env.PORT;


const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // Root test route
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("Server is running and connected to MongoDB");
  }

  // REGISTER
  if (req.method === "POST" && req.url === "/register") {
  return register(req, res);
  }
  // LOGIN
  if (req.method === "POST" && req.url === "/login") {
  return login(req, res);
  }

  // CREATE USER (manual testing route)
  if (req.method === "POST" && req.url === "/users") {
    try {
      const data = await parseBody(req);

      const db = await connectDB();
      const users = db.collection("users");

      const result = await users.insertOne(data);

      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ id: result.insertedId }));

    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // GET USERS
  if (req.method === "GET" && req.url === "/users") {
    try {
      const db = await connectDB();
      const users = db.collection("users");

      const allUsers = await users.find().toArray();

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(allUsers));

    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }
  // fallback
  res.writeHead(404);
  res.end("Not Found");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});