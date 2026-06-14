import { getDb } from "../db.js";
import { ObjectId } from "mongodb";

export const getAllLessons = async (req, res) => {
  try {
    const db = await getDb();

    const lessons = db.collection("lessons");

    const allLessons = await lessons.find().toArray();

    return res.json(allLessons);

  } catch (err) {
    console.error("GetAllLessons error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

 export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const numericId = Number(id);

    if (isNaN(numericId)) {
      return res.status(400).json({
        message: "Lesson id must be a number",
      });
    }

    const db = await getDb();
    const lessons = db.collection("lessons");

    const lesson = await lessons.findOne({
      lesson_id: numericId,
    });

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found",
      });
    }

    return res.json(lesson);

  } catch (err) {
    console.error("GetLessonById error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};