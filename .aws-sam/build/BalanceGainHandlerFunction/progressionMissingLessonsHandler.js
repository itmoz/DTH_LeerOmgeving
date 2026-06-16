import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://BrokeMo:boV4QYrwCcwBZOA1@cluster0.jtprcms.mongodb.net/?appName=Cluster0"
);

export const handler = async (event) => {
  console.log("[handler] Event received:", JSON.stringify(event));

  try {
    const { userId, missingProgressions } = event.detail;

    if (!userId || !Array.isArray(missingProgressions)) {
      console.warn("[handler] Invalid payload");
      return;
    }

    const db = client.db("dth");
    const users = db.collection("users");

    if (!client.topology?.isConnected()) {
      await client.connect();
    }
    
    const uniqueLessons = new Map();

    for (const item of missingProgressions) {
      const lessonId = Number(item.lesson_id);
      if (!Number.isFinite(lessonId)) continue;

      if (!uniqueLessons.has(lessonId)) {
        uniqueLessons.set(lessonId, {
          lesson_id: lessonId,
          completed: false,
        });
      }
    }

    const lessonsToInsert = [...uniqueLessons.values()];

    console.log("[handler] Cleaned lessons:", lessonsToInsert);

    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { progression: 1 } }
    );

    const existing = new Set(
      (user?.progression || []).map((p) => Number(p.lesson_id))
    );

    const trulyMissing = lessonsToInsert.filter(
      (l) => !existing.has(Number(l.lesson_id))
    );

    if (trulyMissing.length === 0) {
      console.log("[handler] Nothing to insert (already in DB)");
      return;
    }

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $addToSet: {
          progression: {
            $each: trulyMissing,
          },
        },
      }
    );

    console.log("[handler] Inserted safely (modifiedCount):", result.modifiedCount);
  } catch (error) {
    console.error("[handler] Error:", error);
  }
};