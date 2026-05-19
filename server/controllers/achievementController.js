import { connectDB } from "../database.js";
import { parseBody } from "../utils.js";
import { ObjectId } from "mongodb";

export async function getAchievements(req, res) {
  try {
    const db = await connectDB();
    const url = new URL(req.url, `http://${req.headers.host}`);
    const email = url.searchParams.get("email");

    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Email required" }));
    }

    // Get all achievements
    const achievements = await db
      .collection("achievements")
      .find({})
      .toArray();

    // Get user progress for each
    const enriched = await Promise.all(
      achievements.map(async (ach) => {
        const progress = await db
          .collection("user_achievements")
          .findOne({ email, achievementId: ach._id });

        const triggerThreshold = Math.max(1, Number(ach.triggerThreshold) || 1);
        const timesTriggered = Number(progress?.timesTriggered) || 0;
        const achievedCount = Number(progress?.achievedCount) || 0;
        const normalizedProgress = achievedCount >= 1
          ? triggerThreshold
          : (timesTriggered > 0 ? (timesTriggered % triggerThreshold || triggerThreshold) : 0);

        return {
          _id: ach._id,
          title: ach.name,
          achievementText: ach.description,
          firstTimeReward: ach.firstTimeReward,
          trigger: ach.trigger,
          triggerThreshold,
          progress: normalizedProgress,
          achievedCount,
          timesTriggered,
          maxProgress: triggerThreshold,
        };
      })
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, achievements: enriched }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

export async function triggerAchievementProgress(req, res) {
  try {
    const db = await connectDB();
    const { email, eventName, eventData } = await parseBody(req);

    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Email required" }));
    }

    // Find achievements triggered by this event
    const achievements = await db
      .collection("achievements")
      .find({ trigger: eventName })
      .toArray();

    const unlockedAchievements = [];

    for (const achievement of achievements) {
      let userAchievement = await db
        .collection("user_achievements")
        .findOne({ email, achievementId: achievement._id });

      if (!userAchievement) {
        // Create initial progress
        await db.collection("user_achievements").insertOne({
          email,
          achievementId: achievement._id,
          progress: 0,
          achievedCount: 0,
          timesTriggered: 0,
          firstTimeRedeemed: false,
          updatedAt: new Date(),
        });
        userAchievement = { progress: 0, achievedCount: 0, timesTriggered: 0, firstTimeRedeemed: false };
      }

      const triggerThreshold = Math.max(1, Number(achievement.triggerThreshold) || 1);
      // Allow eventData to carry a numeric increment (e.g. coins earned amount)
      const increment = Math.max(0, Number(eventData?.amount ?? eventData?.increment ?? 1));
      const nextTimesTriggered = (Number(userAchievement.timesTriggered) || 0) + increment;
      const completedCount = Math.floor(nextTimesTriggered / triggerThreshold);
      const newProgress = nextTimesTriggered % triggerThreshold || (nextTimesTriggered > 0 ? triggerThreshold : 0);
      // After the achievement has been completed once, keep the progress bar full
      // (so the UI doesn't show partial progress for subsequent cycles).
      const progressToStore = (Number(userAchievement.achievedCount) || 0) >= 1 || completedCount >= 1
        ? triggerThreshold
        : newProgress;

      await db.collection("user_achievements").updateOne(
        { email, achievementId: achievement._id },
        {
          $set: {
            progress: progressToStore,
            achievedCount: completedCount,
            timesTriggered: nextTimesTriggered,
            // mark first time redeemed when we've reached the first completion
            firstTimeRedeemed: Boolean(userAchievement.firstTimeRedeemed) || completedCount >= 1,
            updatedAt: new Date(),
          },
        }
      );

      // Check if unlocked
      if (completedCount >= 1 && !userAchievement.firstTimeRedeemed) {
        // Award coins
        await db
          .collection("users")
          .updateOne({ email }, { $inc: { balance: achievement.firstTimeReward } });

        // Mark as redeemed once
        await db.collection("user_achievements").updateOne(
          { email, achievementId: achievement._id },
          {
            $set: {
              firstTimeRedeemed: true,
            },
          }
        );

        unlockedAchievements.push({
          name: achievement.name,
          reward: achievement.firstTimeReward,
        });
      }
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, unlockedAchievements }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}