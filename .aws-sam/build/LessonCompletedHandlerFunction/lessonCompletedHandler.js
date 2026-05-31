import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://BrokeMo:boV4QYrwCcwBZOA1@cluster0.jtprcms.mongodb.net/?appName=Cluster0"
);

export const handler = async (event) => {
  console.log("🚀 LessonCompleted handler triggered");
  console.log("📩 Raw event:", JSON.stringify(event, null, 2));

  try {
    const { userId, lesson_id } = event.detail || {};

    const lessonIdNum = Number(lesson_id);

    console.log("🔌 Connecting to MongoDB...");
    await client.connect();
    console.log("✅ Connected");

    const db = client.db("dth"); // <-- FIX THIS
    console.log("📦 Using DB: dth");

    const users = db.collection("users");

    const result = await users.updateOne(
      {
        _id: new ObjectId(userId),
        "progression.lesson_id": lessonIdNum,
      },
      {
        $set: {
          "progression.$.completed": true,
          "progression.$.completedAt": new Date(),
        },
      }
    );

    console.log("📊 matched:", result.matchedCount);
    console.log("📊 modified:", result.modifiedCount);

    return { statusCode: 200 };
  } catch (err) {
    console.log("💥 ERROR:", err);
    return { statusCode: 500, body: err.message };
  }
};