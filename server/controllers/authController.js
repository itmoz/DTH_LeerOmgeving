import { connectDB } from "../database.js";
import { parseBody } from "../utils.js";

// REGISTER
export async function register(req, res) {
  try {
    const body = await parseBody(req);

    const db = await connectDB();
    const users = db.collection("users");

    const existingUser = await users.findOne({ email: body.email });

    if (existingUser) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User already exists" }));
    }

    const result = await users.insertOne({
      email: body.email,
      passwordHash: body.passwordHash,
      salt: body.salt,
      balance: 1000
    });

    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ id: result.insertedId }));

  } catch (err) {
    res.writeHead(500);
    return res.end(JSON.stringify({ error: err.message }));
  }
}

//  LOGIN
export async function login(req, res) {
  try {
    const body = await parseBody(req);

    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email: body.email });

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    if (user.passwordHash !== body.passwordHash) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Wrong password" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Login success" }));

  } catch (err) {
    res.writeHead(500);
    return res.end(JSON.stringify({ error: err.message }));
  }
}