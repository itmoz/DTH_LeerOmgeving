// server/db.js
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://BrokeMo:boV4QYrwCcwBZOA1@cluster0.jtprcms.mongodb.net/?appName=Cluster0";
const dbName = process.env.DB_NAME;

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