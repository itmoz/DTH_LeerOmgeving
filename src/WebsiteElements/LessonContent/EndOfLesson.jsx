import React from "react";
import { useNavigate } from "react-router-dom";
import { triggerAchievement } from "../../utils/achievementSystem";

export default function EndOfLesson({
  prevLessonPath,
  nextLessonPath,
  dashboardPath = "/",
  achievementEventName = "lesson_completed",
  achievementEventData = {},
  requireQuizCompletion = false, // <-- Nieuwe optional flag
  isQuizCompleted = false,       // <-- Status van de quiz
}) {
  const navigate = useNavigate();

  // We check if both paths are provided to determine if we are in the "middle" of the lessons
  const hasBothLessons = prevLessonPath && nextLessonPath;

  const handleLessonComplete = () => {
    void triggerAchievement(achievementEventName, achievementEventData);
  };

  // Bepaal of de 'Volgende Les' knop geblokkeerd moet worden
  const isNextBlocked = requireQuizCompletion && !isQuizCompleted;

  return (
    <div
      className="p-4 mt-4 w-100"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "20px",
        border: "2px solid #e9ecef",
      }}
    >
      <h3
        className="text-center mb-4"
        style={{ color: "#333", fontWeight: "bold" }}
      >
        Klaar met deze les!
      </h3>

      {/* Top Row: Previous and Next / Dashboard Fallbacks */}
      <div className="d-flex flex-column flex-md-row gap-3 justify-content-center w-100">
        {/* Left Slot: Previous Lesson OR Dashboard */}
        {prevLessonPath ? (
          <button
            className="btn btn-outline-primary py-3 px-4 flex-grow-1"
            style={{
              borderRadius: "15px",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
            onClick={() => {
              handleLessonComplete();
              navigate(prevLessonPath);
            }}
          >
            ⬅️ Vorige Les
          </button>
        ) : (
          <button
            className="btn btn-outline-secondary py-3 px-4 flex-grow-1"
            style={{
              borderRadius: "15px",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
            onClick={() => {
              handleLessonComplete();
              navigate(dashboardPath);
            }}
          >
            🏠 Terug naar Dashboard
          </button>
        )}

        {/* Right Slot: Next Lesson OR Dashboard */}
        {nextLessonPath ? (
          <div className="flex-grow-1 d-flex flex-column">
            <button
              className={`btn ${isNextBlocked ? 'btn-secondary' : 'btn-primary'} py-3 px-4 w-100`}
              style={{
                borderRadius: "15px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: isNextBlocked ? 'not-allowed' : 'pointer',
                opacity: isNextBlocked ? 0.7 : 1
              }}
              disabled={isNextBlocked}
              onClick={() => {
                if (isNextBlocked) return;
                handleLessonComplete();
                navigate(nextLessonPath);
              }}
            >
              Volgende Les ➡️
            </button>
            {/* Communicatie naar de gebruiker als de knop geblokkeerd is */}
            {isNextBlocked && (
              <small className="text-danger mt-2 text-center fw-bold">
                <i className="bi bi-exclamation-circle me-1"></i>
                Maak eerst de quiz af om verder te gaan.
              </small>
            )}
          </div>
        ) : (
          <button
            className="btn btn-success py-3 px-4 flex-grow-1"
            style={{
              borderRadius: "15px",
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
            onClick={() => {
              handleLessonComplete();
              navigate(dashboardPath);
            }}
          >
            🏠 Afronden & Naar Dashboard
          </button>
        )}
      </div>

      {/* Bottom Slot: Dashboard Button (ONLY shows if both Prev and Next buttons exist) */}
      {hasBothLessons && (
        <div className="mt-3 d-flex justify-content-center w-100">
          <button
            className="btn btn-outline-secondary py-2 px-4 w-100"
            style={{
              borderRadius: "15px",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
            onClick={() => {
              handleLessonComplete();
              navigate(dashboardPath);
            }}
          >
            🏠 Terug naar Dashboard
          </button>
        </div>
      )}
    </div>
  );
}