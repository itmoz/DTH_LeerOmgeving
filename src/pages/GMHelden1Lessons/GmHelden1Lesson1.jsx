import React from "react";

// this file is in src/AppRoutes/AppRoutesGMHelden1.jsx
export default function GmHelden1Lesson1() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        // Soft gradient background suitable for children
        background: "linear-gradient(135deg, primary, #ffffff 100%)",
        padding: "2rem",
      }}
    >
      <div
        className="card shadow p-4 p-md-5"
        style={{
          borderRadius: "30px", // Large rounded corners for the main container
          border: "none",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <h1 className="text-center" style={{ color: "#ff6b6b" }}>
          GmHelden1Lesson1
        </h1>


      {/* Learning goals styled as a "Mission Board" */}
        <div 
          className="card mx-auto mb-5 border-0 shadow-sm" 
          style={{ width: "100%", maxWidth: "800px", borderRadius: "15px"}}
        >
          <div className="card-header bg-primary text-white text-center fw-bold" style={{ borderRadius: "15px 15px 0 0", fontSize: "1.2rem" }}>
            🎯 Aan het einde van deze les leer je...
          </div>
          <ul className="list-group list-group-flush" style={{ borderRadius: "0 0 15px 15px" }}>
            <li className="list-group-item bg-transparent fs-5 py-3 border-bottom">
              ⭐ Wat is Roblox?
            </li>
            <li className="list-group-item bg-transparent fs-5 py-3 border-bottom">
              💻 Hoe speel je Roblox op de computer?
            </li>
            <li className="list-group-item bg-transparent fs-5 py-3">
              🛠️ Hoe maak je je eigen game?
            </li>
          </ul>
        </div>

        {/* Content section with colored background and rounded corners */}
        <div
          className="p-4 bg-primary bg-opacity-10"
          style={{
            borderRadius: "20px",
          }}
        >
          <h2 className="text-center mt-2 mb-3" style={{ color: "#1e88e5" }}>
            Wat is Roblox?
          </h2>
          <p className="text-center">
            Roblox is een unieke app voor telefoon, computer en je console. Het
            is niet alleen een online platform waar mensen allemaal unieke
            spellen kunnen spelen alleen of met vrienden, maar het is ook een
            heel game creatie systeem waar iedereen spellen in kan maken!
          </p>
          <p className="text-center">
            In de aankomende lessen zullen we de basis van Roblox
            spelontwikkeling leren, aan het einde hebben we onze eigen obby game
            gemaakt!
          </p>
        </div>
      </div>
    </div>
  );
}