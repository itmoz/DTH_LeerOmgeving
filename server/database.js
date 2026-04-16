import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is not defined in your .env file");
}

const client = new MongoClient(uri);

let db;

export async function connectDB() {
  try {
    if (db) return db; // reuse existing connection

    await client.connect();

    db = client.db("DTH-Leeromgeving"); // your DB name

    console.log("Connected to MongoDB Atlas");

    return db;

  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}