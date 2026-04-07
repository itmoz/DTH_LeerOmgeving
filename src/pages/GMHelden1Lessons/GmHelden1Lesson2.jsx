import React from "react";
// FIXED: Changed the capital 'M' to a lowercase 'm' to match the component below
import ProgressCheckmarkCard from "../../WebsiteElements/Card/ProgressCheckmarkCard.jsx"; 
import GradientBackground from "../../WebsiteElements/BackgroundGradient/GradientBackground.jsx";

export default function GmHelden1Lesson2() {
  const lessonChecklist = [
    { id: 1, text: "Wat is Roblox?", checked: false },
    { id: 2, text: "Hoe speel je Roblox op computer?", checked: false },
    { id: 3, text: "Hoe maak je een game in Roblox?", checked: false },
  ];


  return (
    <GradientBackground>
    <div
      className="d-flex justify-content-center align-items-center flex-column"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, primary, #fffefe 100%)",
        padding: "2rem",
      }}
    >
      <h1 className="text-center mb-4">
        Jouw Missie van Vandaag!
      </h1>

      <div className="mb-5 w-100">
        <ProgressCheckmarkCard 
          title="Wat we gaan leren"
          items={lessonChecklist}
          iconSize="2rem" 
          itemPadding="1.5rem 0" 
        />
      </div>

      <div className="w-100">
        <ProgressCheckmarkCard 
          title="Heb je dit al gedaan?"
          items={[
            { id: 1, text: "Computer opgestart", checked: true },
            { id: 2, text: "Roblox Studio gedownload", checked: false },
          ]}
          iconPosition="end"
          bgColor="#fff9c4" 
          headingColor="#f57f17" 
          itemPadding="0.75rem 0"
        />
      </div>

    </div>
  </GradientBackground>
  );
}