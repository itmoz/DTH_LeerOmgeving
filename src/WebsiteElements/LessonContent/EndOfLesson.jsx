import React from "react";
import { useNavigate } from "react-router-dom";

export default function EndOfLesson({ 
  prevLessonPath, 
  nextLessonPath, 
  dashboardPath = "/" 
}) {
  const navigate = useNavigate();

  // We check if both paths are provided to determine if we are in the "middle" of the lessons
  const hasBothLessons = prevLessonPath && nextLessonPath;

  return (
    <div 
      className="p-4 mt-4 w-100" 
      style={{ 
        backgroundColor: "rgba(255, 255, 255, 0.8)", 
        borderRadius: "20px",
        border: "2px solid #e9ecef"
      }}
    >
      <h3 className="text-center mb-4" style={{ color: "#333", fontWeight: "bold" }}>
        Klaar met deze les!
      </h3>
      
      {/* Top Row: Previous and Next / Dashboard Fallbacks */}
      <div className="d-flex flex-column flex-md-row gap-3 justify-content-center w-100">
        
        {/* Left Slot: Previous Lesson OR Dashboard */}
        {prevLessonPath ? (
          <button 
            className="btn btn-outline-primary py-3 px-4 flex-grow-1"
            style={{ borderRadius: "15px", fontSize: "1.1rem", fontWeight: "bold" }}
            onClick={() => navigate(prevLessonPath)}
          >
            ⬅️ Vorige Les
          </button>
        ) : (
          <button 
            className="btn btn-outline-secondary py-3 px-4 flex-grow-1"
            style={{ borderRadius: "15px", fontSize: "1.1rem", fontWeight: "bold" }}
            onClick={() => navigate(dashboardPath)}
          >
            🏠 Terug naar Dashboard
          </button>
        )}

        {/* Right Slot: Next Lesson OR Dashboard */}
        {nextLessonPath ? (
          <button 
            className="btn btn-primary py-3 px-4 flex-grow-1"
            style={{ borderRadius: "15px", fontSize: "1.1rem", fontWeight: "bold" }}
            onClick={() => navigate(nextLessonPath)}
          >
            Volgende Les ➡️
          </button>
        ) : (
          <button 
            className="btn btn-success py-3 px-4 flex-grow-1"
            style={{ borderRadius: "15px", fontSize: "1.1rem", fontWeight: "bold" }}
            onClick={() => navigate(dashboardPath)}
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
            style={{ borderRadius: "15px", fontSize: "1rem", fontWeight: "bold" }}
            onClick={() => navigate(dashboardPath)}
          >
            🏠 Terug naar Dashboard
          </button>
        </div>
      )}

    </div>
  );
}