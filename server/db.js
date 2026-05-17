// server/db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "dth";

let client;
let db;

export async function getDb() {
  if (db) return db;

  if (!uri) {
    throw new Error("MONGODB_URI is niet gezet in environment variables");
  }

  if (!client) {
    client = new MongoClient(uri, { maxPoolSize: 10 });
    await client.connect();
  }

  db = client.db(dbName);
  return db;
}