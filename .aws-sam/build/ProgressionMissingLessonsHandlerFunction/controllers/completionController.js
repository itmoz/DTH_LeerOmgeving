import { publishDomainEvent } from "../events/publisher.js";

export const completeLesson = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res.status(401).json({ message: "Niet ingelogd" });
    }

    const { lesson_id } = req.body;

    await publishDomainEvent({
      source: "dth.leeromgeving.lesson",
      detailType: "LessonCompleted",
      detail: {
        userId: sessionId,
        lesson_id,
        completedAt: new Date().toISOString(),
      },
    });

    return res.json({
      message: "Lesson completion event sent",
    });

  } catch (err) {
    console.error("completeLesson error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

import { getDb } from "../db.js";
import { ObjectId } from "mongodb";

export const getUserCompletions = async (req, res) => {
  try {
    const sessionId = req.cookies?.session;

    if (!sessionId) {
      return res.json({ user: null });
    }

    if (!ObjectId.isValid(sessionId)) {
      res.clearCookie("session");
      return res.json({ user: null });
    }

    const db = await getDb();
    const users = db.collection("users");
    const lessons = db.collection("lessons");

    const user = await users.findOne({
      _id: new ObjectId(sessionId),
    });

    if (!user) {
      res.clearCookie("session");
      return res.json({ user: null });
    }

    const allLessons = await lessons.find().toArray();

    const existingProgression = user.progression || [];

    const progressionMap = new Map(
      existingProgression.map((p) => [String(p.lesson_id), true])
    );

    const missingProgressions = allLessons
      .filter((lesson) => !progressionMap.has(String(lesson.lesson_id)))
      .map((lesson) => ({
        lesson_id: String(lesson.lesson_id),
        completed: false,
      }));

    // ✅ Publish event only if needed
    if (missingProgressions.length > 0) {
      await publishDomainEvent({
        source: "dth.leeromgeving.progression",
        detailType: "UserProgressionMissingLessons",
        detail: {
          userId: user._id.toString(),
          missingProgressions,
          createdAt: new Date().toISOString(),
        },
      });
    }

    const progression = allLessons.map((lesson) => {
      const existing = progressionMap.get(String(lesson.lesson_id));

      return (
        existing || {
          lesson_id: String(lesson.lesson_id),
          completed: false,
        }
      );
    });

    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        balance: user.balance ?? 0,
        progression,
      },
    });
  } catch (err) {
    console.error("GetUser error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};