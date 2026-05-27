import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE =
  "https://cisf9p7hpa.execute-api.us-east-1.amazonaws.com/Prod";

const LessonPage = () => {

  const { id } = useParams();

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

  if (!lesson) {
    return <div className="container py-5">Loading lesson...</div>;
  }

  return (
    <div className="container py-5">

      <h1 className="mb-4">{lesson.title}</h1>

      <p className="mb-4">{lesson.text}</p>

      {/* Video lesson */}
      {lesson.contentType === "video" && (
        <div className="ratio ratio-16x9">

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

    </div>
  );
};

export default LessonPage;