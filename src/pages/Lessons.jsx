import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE =
  "https://cisf9p7hpa.execute-api.us-east-1.amazonaws.com/Prod";

const LessonPage = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);

  useEffect(() => {

    const fetchLesson = async () => {
      try {

        const res = await fetch(`${API_BASE}/lessons/${id}`);

        const data = await res.json();

        setLesson(data);

      } catch (err) {
        console.error("Error fetching lesson:", err);
      }
    };

    fetchLesson();

  }, [id]);

  const completeLesson = async () => {
    try {

      const res = await fetch(`${API_BASE}/completeLesson`, {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          lesson_id: lesson.lesson_id,
        }),
      });

      const data = await res.json();

      console.log(data);

      alert("Lesson completed!");

      navigate("/learningdashboard");

    } catch (err) {
      console.error("Error completing lesson:", err);
    }
  };

  if (!lesson) {
    return <div className="container py-5">Loading lesson...</div>;
  }

  return (
    <div className="container py-5">

      {/* Back button */}
      <button
        className="btn btn-secondary mb-4"
        onClick={() => navigate("/learningdashboard")}
      >
        ← Back
      </button>

      <h1 className="mb-4">{lesson.title}</h1>

      <p className="mb-4">{lesson.text}</p>

      {/* Video lesson */}
      {lesson.contentType === "video" && (
        <div className="ratio ratio-16x9 mb-4">

          <iframe
            src={`https://www.youtube.com/embed/${
              lesson.content.videoUrl.split("v=")[1]
            }`}
            title="Lesson Video"
            allowFullScreen
          />

        </div>
      )}

      {/* Game lesson */}
      {lesson.contentType === "game" && (
        <iframe
          src={lesson.content.gameUrl}
          title="Lesson Game"
          width="100%"
          height="700"
          style={{
            border: "none",
          }}
        />
      )}

      {/* Complete lesson button */}
      <div className="mt-5 text-center">

        <button
          className="btn btn-success btn-lg"
          onClick={completeLesson}
        >
          Complete Lesson
        </button>

      </div>

    </div>
  );
};

export default LessonPage;