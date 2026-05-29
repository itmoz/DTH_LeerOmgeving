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