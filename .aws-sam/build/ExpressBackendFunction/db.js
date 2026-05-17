// db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; 
let client;
let db;

export async function getDb() {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  db = client.db("dth"); // zelfde naam als in je connection string
  return db;
}