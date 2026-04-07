import React from "react";
import ProgressCheckmarkCard from "../../WebsiteElements/Card/ProgressCheckmarkCard.jsx";
import MissionBoard from "../../WebsiteElements/LessonContent/MissionBoard.jsx";
import ContentSection from "../../WebsiteElements/LessonContent/ContentSection.jsx";

// 1. Importeer hier je nieuwe achtergrond component! 
// (Pas dit pad aan naar de map waar jij GradientBackground hebt opgeslagen)
import GradientBackground from "../../WebsiteElements/BackgroundGradient/GradientBackground.jsx";

export default function GmHelden1Lesson1() {
  // We maken een lijstje (array) van de doelen voor deze les
  const lessonGoals = [
    "⭐ Wat is Roblox?",
    "💻 Hoe speel je Roblox op de computer?",
    "🛠️ Hoe maak je je eigen game?"
  ];

  return (
    // 2. We wikkelen nu alles in onze nieuwe GradientBackground component!
    <GradientBackground>
      <div
        className="card shadow p-4 p-md-5"
        style={{
          borderRadius: "30px",
          border: "none",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <h1 className="text-center mb-4" style={{ color: "#ff6b6b" }}>
          GmHelden1Lesson1
        </h1>

        {/* 1. Onze herbruikbare Mission Board! */}
        <MissionBoard goals={lessonGoals} />

        {/* 2. Onze herbruikbare Content Section! */}
        <ContentSection title="Wat is Roblox?">
          <p>
            Roblox is een unieke app voor telefoon, computer en je console. Het
            is niet alleen een online platform waar mensen allemaal unieke
            spellen kunnen spelen alleen of met vrienden, maar het is ook een
            heel game creatie systeem waar iedereen spellen in kan maken!
          </p>
          <p>
            In de aankomende lessen zullen we de basis van Roblox
            spelontwikkeling leren, aan het einde hebben we onze eigen obby game
            gemaakt!
          </p>
        </ContentSection>

        <ContentSection title={"Hoe Speel je Roblox?"}>
          <p>
            Roblox is super makkelijk te spelen! Je hoeft alleen maar een account
            aan te maken, Roblox Studio te downloaden (dat is de tool waarmee we
            onze games gaan maken) en je bent klaar om te spelen en te creëren!
          </p>
          <p>
            Je kunt kiezen uit miljoenen spellen gemaakt door andere gebruikers, of
            je kunt zelf aan de slag gaan en je eigen spel maken!
          </p>
        </ContentSection>

        {/* Bestaande voortgangskaart */}
        <div className="w-100">
          <ProgressCheckmarkCard
            title="Heb je dit al gedaan?"
            items={[
              { id: 1, text: "Computer opgestart", checked: false },
              { id: 2, text: "Roblox Studio gedownload", checked: false },
            ]}
            iconPosition="end"
            bgColor="#fff9c4"
            headingColor="#f57f17"
            itemPadding="0.75rem 0"
            PlaysConfetti={false}
          />
        </div>
      </div>
    </GradientBackground>
  );
}