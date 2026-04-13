import http from "http";
import { connectDB } from "./database.js";
import { parseBody } from "./utils.js";

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  // ✅ Route: POST /users
  if (req.method === "POST" && req.url === "/users") {
    try {
      const data = await parseBody(req);

      const db = await connectDB();
      const users = db.collection("users");

      const result = await users.insertOne(data);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ id: result.insertedId }));

    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  }

  else if (req.method === "GET" && req.url === "/users") {
    try {
      const db = await connectDB();
      const users = db.collection("users");

      const allUsers = await users.find().toArray();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(allUsers));

    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  }

  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});