import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://BrokeMo:boV4QYrwCcwBZOA1@cluster0.jtprcms.mongodb.net/?appName=Cluster0"
);

export const handler = async (event) => {
  try {
    const { userId } = event.detail || {};

    if (!userId) {
      throw new Error("Missing userId in event.detail");
    }

    await client.connect();

    const db = client.db("dth");
    const users = db.collection("users");
    const rewardAmount = 10;

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $inc: {
          balance: rewardAmount,
        },
      }
    );

    console.log("Balance updated:", {
      userId,
      rewardAmount,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        rewardAmount,
      }),
    };
  } catch (error) {
    console.error("Balance reward handler error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};