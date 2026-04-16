import { connectDB } from "../database.js";
import { parseBody } from "../utils.js";

// REGISTER
export async function register(req, res) {
  try {
    const { email, passwordHash, salt } = await parseBody(req);

    if (!email || !passwordHash || !salt) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing fields" }));
    }

    const db = await connectDB();
    const users = db.collection("users");

    // check if user exists
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User already exists" }));
    }

    // insert user
    const result = await users.insertOne({
      email,
      passwordHash,
      salt,
      createdAt: new Date()
    });

    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      success: true,
      id: result.insertedId
    }));

  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

// LOGIN
export async function login(req, res) {
  try {
    const { email, passwordHash } = await parseBody(req);

    if (!email || !passwordHash) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Missing fields" }));
    }

    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    if (user.passwordHash === passwordHash) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: true }));
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Wrong password" }));
    }

  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}