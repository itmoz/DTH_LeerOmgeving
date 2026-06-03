import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://BrokeMo:boV4QYrwCcwBZOA1@cluster0.jtprcms.mongodb.net/?appName=Cluster0"
);

export const handler = async (event) => {

  try {
    const { userId, lesson_id } = event.detail || {};

    const lessonIdNum = Number(lesson_id);

    await client.connect();

    const db = client.db("dth");

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

    return { statusCode: 200 };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};