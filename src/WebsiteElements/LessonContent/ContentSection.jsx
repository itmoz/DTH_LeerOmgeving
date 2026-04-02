import React from "react";

export default function ContentSection({ title, titleColor = "#1e88e5", children }) {
  return (
    <div
      className="p-4 bg-primary bg-opacity-10 mb-4"
      style={{
        borderRadius: "20px",
      }}
    >
      {/* Laat de titel alleen zien als er een titel is opgegeven */}
      {title && (
        <h2 className="text-center mt-2 mb-3" style={{ color: titleColor }}>
          {title}
        </h2>
      )}
      
      {/* Hier komt de tekst (of andere elementen) die je in de component plaatst */}
      <div className="text-center">
        {children}
      </div>
    </div>
  );
}