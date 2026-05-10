import { connectDB } from "../database.js";
import { parseBody } from "../utils.js";
import bcrypt from "bcrypt";

// REGISTER
export async function register(req, res) {
  try {
    const { email, password } = await parseBody(req);

    if (!email || !password) {
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

    const passwordHash = await bcrypt.hash(password, 12);

    // insert user
    const result = await users.insertOne({
      email,
      passwordHash,
      balance: 0,
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
    const { email, password } = await parseBody(req);

    if (!email || !password) {
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

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (isValidPassword) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        success: true,
        balance: user.balance ?? 0
      }));
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Wrong password" }));
    }

  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

// GET USER
export async function getUser(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const email = url.searchParams.get('email');

    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Email required" }));
    }

    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    // Return minimal user fields for client-side usage
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ email: user.email }));

  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

// GET BALANCE
export async function getBalance(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const email = url.searchParams.get("email");

    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Email required" }));
    }

    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne(
      { email },
      { projection: { balance: 1 } }
    );

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ balance: user.balance ?? 0 }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

// ADD BALANCE
export async function addBalance(req, res) {
  try {
    const { email, amount } = await parseBody(req);

    // Check against undefined so an amount of 0 doesn't trigger an error
    if (!email || amount === undefined) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Email and amount required" }));
    }

    const numericAmount = Number(amount);
    const db = await connectDB();
    const users = db.collection("users");

    // 1. Fetch the user to check their current balance
    const user = await users.findOne({ email });

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    const currentBalance = user.balance || 0;

    // 2. Check if a subtraction pushes the balance below zero
    if (numericAmount < 0 && currentBalance + numericAmount < 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "You do not have enough balance" }));
    }

    // 3. Proceed with the update
    await users.updateOne(
      { email },
      { $inc: { balance: numericAmount } }
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      success: true,
      balance: currentBalance + numericAmount
    }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}