import { getDb } from "../db.js";
import { ObjectId } from "mongodb";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email en wachtwoord verplicht" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const db = await getDb();
    console.log("Gebruik database:", db.databaseName);
    const users = db.collection("users");

    const count = await users.countDocuments();
    console.log("Aantal users in deze DB:", count);

    const existing = await users.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "Email al in gebruik" });
    }

    const result = await users.insertOne({
      email: normalizedEmail,
      password,        // LATER: password hashen!
      balance: 0,
      createdAt: new Date(),
    });

    return res.json({
      message: "user registered",
      userId: result.insertedId,
      email: normalizedEmail,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email en wachtwoord verplicht" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const db = await getDb();
    const users = db.collection("users");

    const user = await users.findOne({ email: normalizedEmail });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Onjuiste inloggegevens" });
    }

    // Simpele session cookie (voor nu)
    res.cookie("session", user._id.toString(), {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // lokaal: false, productie: true (https)
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.json({
      message: "Inloggen geslaagd",
      email: user.email,
      balance: user.balance ?? 0,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.json({ user: null });
    }

    // extra check: is het een geldige ObjectId?
    if (!ObjectId.isValid(sessionId)) {
      res.clearCookie("session");
      return res.json({ user: null });
    }

    const db = await getDb();
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(sessionId) });
    if (!user) {
      res.clearCookie("session");
      return res.json({ user: null });
    }

    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        balance: user.balance ?? 0,
      },
    });
  } catch (err) {
    console.error("GetUser error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("session");
  return res.json({ message: "Uitgelogd" });
};

export const getBalance = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(401).json({ message: "Niet ingelogd" });
    }

    const db = await getDb();
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(sessionId) });
    if (!user) {
      return res.status(404).json({ message: "User niet gevonden" });
    }

    return res.json({ balance: user.balance ?? 0 });
  } catch (err) {
    console.error("getBalance error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};