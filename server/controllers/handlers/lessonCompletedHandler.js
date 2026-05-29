import { getDb } from "../db.js";

export const lambdaHandler = async (event) => {
  console.log("LessonCompleted received:", JSON.stringify(event, null, 2));

  const { userId, lesson_id } = event.detail;

  try {
    const db = await getDb();
    const users = db.collection("users");

    // 1. Update the specific lesson in progression
    await users.updateOne(
      {
        _id: new ObjectId(userId),
        "progression.lesson_id": lesson_id,
      },
      {
        $set: {
          "progression.$.completed": true,
        },
      }
    );

    console.log(`Lesson ${lesson_id} marked complete for user ${userId}`);

    return {
      statusCode: 200,
      body: "Lesson processed",
    };

  } catch (err) {
    console.error("LessonCompleted handler error:", err);

    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }
};