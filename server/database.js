import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("DTH-Leeromgeving");
    console.log("Connected to MongoDB");
  }
  return db;
}