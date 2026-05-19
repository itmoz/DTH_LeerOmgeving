import React from "react";

export default function MissionBoard({
  title = "🎯 Aan het einde van deze les leer je...",
  goals,
}) {
  return (
    <div
      className="card mx-auto mb-5 border-0 shadow-sm"
      style={{ width: "100%", maxWidth: "800px", borderRadius: "15px" }}
    >
      <div
        className="card-header bg-primary text-white text-center fw-bold"
        style={{ borderRadius: "15px 15px 0 0", fontSize: "1.2rem" }}
      >
        {title}
      </div>
      <ul
        className="list-group list-group-flush"
        style={{ borderRadius: "0 0 15px 15px" }}
      >
        {goals.map((goal, index) => (
          <li
            key={index}
            // Zorg ervoor dat het laatste item geen randje aan de onderkant krijgt
            className={`list-group-item bg-transparent fs-5 py-3 ${index !== goals.length - 1 ? "border-bottom" : ""}`}
          >
            {goal}
          </li>
        ))}
      </ul>
    </div>
  );
}
