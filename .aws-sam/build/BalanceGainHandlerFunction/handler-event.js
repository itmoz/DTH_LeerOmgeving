import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb+srv://BrokeMo:boV4QYrwCcwBZOA1@cluster0.jtprcms.mongodb.net/?appName=Cluster0");

export const handler = async (event) => {
  console.log("EVENT:", JSON.stringify(event));

  const { userId } = event.detail;

  await client.connect();

  const db = client.db("your-db");
  const users = db.collection("users");

  const user = await users.findOne({
    _id: new ObjectId(userId),
  });

  console.log("Found user:", user);

  return { statusCode: 200 };
};