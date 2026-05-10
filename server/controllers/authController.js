import { connectDB } from "../database.js";
import { parseBody } from "../utils.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const SESSION_COOKIE_NAME = "dth_session";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000;

const sessions = new Map();
const loginAttempts = new Map();

async function persistSecurityEvent(entry) {
  try {
    const db = await connectDB();
    await db.collection("security_events").insertOne(entry);
  } catch (err) {
    console.error("security_events insert error", err);
  }
}

function logSecurityEvent(event, details = {}) {
  const entry = {
    level: "info",
    event,
    timestamp: new Date(),
    ...details
  };

  console.info(`[security] ${event}`, entry);
  void persistSecurityEvent(entry);
}

function logSecurityError(event, error, details = {}) {
  const entry = {
    level: "error",
    event,
    message: error?.message || "Unknown error",
    timestamp: new Date(),
    ...details
  };

  console.error(`[security-error] ${event}`, error);
  void persistSecurityEvent(entry);
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function parseCookies(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return {};

  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, cookiePart) => {
      const separatorIndex = cookiePart.indexOf("=");
      if (separatorIndex === -1) return cookies;

      const key = decodeURIComponent(cookiePart.slice(0, separatorIndex));
      const value = decodeURIComponent(cookiePart.slice(separatorIndex + 1));
      cookies[key] = value;
      return cookies;
    }, {});
}

function serializeSessionCookie(sessionId, maxAgeSeconds = SESSION_TIMEOUT_MS / 1000) {
  const isProduction = process.env.NODE_ENV === "production";
  const attributes = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${Math.floor(maxAgeSeconds)}`
  ];

  if (isProduction) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", serializeSessionCookie("", 0));
}

function getSession(req) {
  const cookies = parseCookies(req);
  const sessionId = cookies[SESSION_COOKIE_NAME];
  if (!sessionId) return null;

  const session = sessions.get(sessionId);
  if (!session) return null;

  if (session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  session.expiresAt = Date.now() + SESSION_TIMEOUT_MS;
  sessions.set(sessionId, session);

  return { sessionId, email: session.email };
}

function requireSession(req, res) {
  const session = getSession(req);
  if (!session) {
    clearSessionCookie(res);
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return null;
  }
  return session;
}

function getAttemptKey(email, ip) {
  return `${email.toLowerCase()}|${ip}`;
}

function resetAttempts(key) {
  loginAttempts.delete(key);
}

function registerFailedAttempt(key) {
  const current = loginAttempts.get(key) || { count: 0, lockUntil: 0 };
  current.count += 1;

  if (current.count >= LOGIN_MAX_ATTEMPTS) {
    current.lockUntil = Date.now() + LOGIN_LOCKOUT_MS;
    current.count = 0;
  }

  loginAttempts.set(key, current);
  return current;
}

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
    logSecurityError("register_error", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Internal server error" }));
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

    const ip = getClientIp(req);
    const attemptKey = getAttemptKey(email, ip);
    const attemptState = loginAttempts.get(attemptKey);
    if (attemptState?.lockUntil && attemptState.lockUntil > Date.now()) {
      logSecurityEvent("login_blocked_lockout", { email, ip });
      res.writeHead(429, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Te veel mislukte pogingen. Probeer later opnieuw." }));
    }

    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      registerFailedAttempt(attemptKey);
      logSecurityEvent("login_failed_user_not_found", { email, ip });
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (isValidPassword) {
      resetAttempts(attemptKey);

      const sessionId = randomUUID();
      sessions.set(sessionId, {
        email,
        expiresAt: Date.now() + SESSION_TIMEOUT_MS
      });

      res.setHeader("Set-Cookie", serializeSessionCookie(sessionId));
      logSecurityEvent("login_success", { email, ip });

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        success: true,
        email,
        balance: user.balance ?? 0
      }));
    } else {
      const failedState = registerFailedAttempt(attemptKey);
      logSecurityEvent("login_failed_wrong_password", {
        email,
        ip,
        lockoutActivated: Boolean(failedState.lockUntil && failedState.lockUntil > Date.now())
      });
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Wrong password" }));
    }

  } catch (err) {
    logSecurityError("login_error", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

// GET USER
export async function getUser(req, res) {
  try {
    const session = requireSession(req, res);
    if (!session) return;

    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email: session.email });

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    // Return minimal user fields for client-side usage
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ email: user.email }));

  } catch (err) {
    logSecurityError("get_user_error", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

// GET BALANCE
export async function getBalance(req, res) {
  try {
    const session = requireSession(req, res);
    if (!session) return;

    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne(
      { email: session.email },
      { projection: { balance: 1 } }
    );

    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ balance: user.balance ?? 0 }));
  } catch (err) {
    logSecurityError("get_balance_error", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

// ADD BALANCE
export async function addBalance(req, res) {
  try {
    const session = requireSession(req, res);
    if (!session) return;

    const { amount } = await parseBody(req);

    // Check against undefined so an amount of 0 doesn't trigger an error
    if (amount === undefined) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Amount required" }));
    }

    const numericAmount = Number(amount);
    const db = await connectDB();
    const users = db.collection("users");

    // 1. Fetch the user to check their current balance
    const user = await users.findOne({ email: session.email });

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
      { email: session.email },
      { $inc: { balance: numericAmount } }
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      success: true,
      balance: currentBalance + numericAmount
    }));
  } catch (err) {
    logSecurityError("add_balance_error", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Internal server error" }));
  }
}

export async function logout(req, res) {
  try {
    const session = getSession(req);
    if (session) {
      sessions.delete(session.sessionId);
      logSecurityEvent("logout", { email: session.email, ip: getClientIp(req) });
    }

    clearSessionCookie(res);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  } catch (err) {
    logSecurityError("logout_error", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Internal server error" }));
  }
}