import React from "react";
import ProgressCheckmarkCard from "../../WebsiteElements/Card/ProgressCheckmarkCard.jsx";
import MissionBoard from "../../WebsiteElements/LessonContent/MissionBoard.jsx";
import ContentSection from "../../WebsiteElements/LessonContent/ContentSection.jsx";
import ImageLoggedIn from "../../Images/LesAfbeeldingen/GMHelden1/Les1/GmHeldenLes1AfbeeldingIngelogd.png";
import LessonQuiz from "../../WebsiteElements/LessonContent/LessonQuiz.jsx";

// 1. Importeer hier je nieuwe achtergrond component! 
// (Pas dit pad aan naar de map waar jij GradientBackground hebt opgeslagen)
import GradientBackground from "../../WebsiteElements/BackgroundGradient/GradientBackground.jsx";

export default function GmHelden1Lesson1() {
  // We maken een lijstje (array) van de doelen voor deze les
  const lessonGoals = [
    "⭐ Wat is Roblox?",
    "💻 Hoe speel je Roblox op de computer?",
    "🛠️ Hoe worden spellen gemaakt in Roblox?",
    "🎮 Hoe kan je je eigen game maken?"
  ];

  const quizQuestions = [
    {
      id: 1,
      type: "multiple-choice",
      question: "Wat is de tool waarmee we games maken in Roblox?",
      options: ["Roblox Player", "Roblox Studio", "Roblox Creator"],
      correctAnswer: "Roblox Studio"
    },
    {
      id: 2,
      type: "text-input",
      question: "Welk spel gaan we samen maken aan het einde van deze lessenreeks? (Typ het woord)",
      correctAnswer: ["obby", "obby game", "een obby", "een obby game", "obbygame"]
    }
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
            Je kunt kiezen uit miljoenen spellen gemaakt door andere gebruikers! 
            Roblox op PC bestaat uit 2 delen: Roblox Studio (waar je spellen maakt) en Roblox Player (waar je spellen speelt).

            Om Roblox Player te installeren moet je op de volgende link klikken: <a href="https://www.roblox.com/download" target="_blank" rel="noopener noreferrer">https://www.roblox.com/download</a>.
          </p>
        </ContentSection>

        <div className="w-100">
          <ProgressCheckmarkCard
            title="Het installeren van Roblox Player"
            items={[
              { id: 1, text: "Naar de pagina van de download gegaan", checked: false },
              { id: 2, text: "Roblox Player gedownload", checked: false },
              { id: 3, text: "Genavigeerd naar je downloads map", checked: false },
              { id: 4, text: "Dubbel geklikt op RobloxPlayerInstaller.exe", checked: false },
              { id: 5, text: "Instructies op je computer gevolgd", checked: false },
              { id: 6, text: "Installatie voltooid!", checked: false },
            ]}
            iconPosition="end"
            bgColor="#fff9c4"
            headingColor="#f57f17"
            itemPadding="0.75rem 0"
          />
        </div>

          <ContentSection
            imageSrc={ImageLoggedIn}
            imageAlt="Roblox Player Ingelogd"
            imageCaption="De Roblox homepagina"
            textBelow={
            <p>
            In de volgende les gaan we samen een Obby maken, dus zorg ervoor dat je Roblox Studio hebt geïnstalleerd en klaar staat om te leren!
            </p>
                      }
          >\
            <p>
            Nadat de applicatie geïnstalleerd is, zie je dit scherm!
          </p>
          </ContentSection>

          <LessonQuiz 
          questions={quizQuestions} 
          balanceGainAmount={50}/>
       </div>
    </GradientBackground>
  );
}