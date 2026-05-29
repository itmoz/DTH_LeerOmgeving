import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export const handler = async (event) => {
  console.log("EVENT:", JSON.stringify(event));

  const { userId } = event.detail;

  if (!client.topology?.isConnected()) {
    await client.connect();
  }

  const db = client.db("your-db");
  const users = db.collection("users");
  const lessons = db.collection("lessons");

  const allLessons = await lessons.find().toArray();

  const progression = allLessons.map((l) => ({
    lesson_id: l.lesson_id,
    completed: false,
  }));

  await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { progression } }
  );

  return { statusCode: 200 };
};