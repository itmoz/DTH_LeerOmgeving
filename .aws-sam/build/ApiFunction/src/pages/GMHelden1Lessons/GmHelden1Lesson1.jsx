import React from "react";
import ProgressCheckmarkCard from "../../WebsiteElements/Card/ProgressCheckmarkCard.jsx";
import MissionBoard from "../../WebsiteElements/LessonContent/MissionBoard.jsx";
import ContentSection from "../../WebsiteElements/LessonContent/ContentSection.jsx";
import ImageLoggedIn from "../../Images/LesAfbeeldingen/GMHelden1/Les1/GmHeldenLes1AfbeeldingIngelogd.png";
import EscapeTWO from "../../Images/LesAfbeeldingen/GMHelden1/Les1/EscapeTheWorldObby.png";
import LessonQuiz from "../../WebsiteElements/LessonContent/LessonQuiz.jsx";
import EndOfLesson from "../../WebsiteElements/LessonContent/EndOfLesson.jsx";

// Importeer hier je nieuwe achtergrond component!
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
      answerIncludes: ["obby", "platformer"], // We accepteren meerdere antwoorden zolang ze maar een van deze woorden bevatten
      correctAnswer: ["obby", "obby game", "een obby", "een obby game", "obbygame", "platformer", "een platformer", "platformer game", "een platformer game"]
    }
  ];

  // DEBUG FUNCTIE: Maakt de opgeslagen voortgang leeg en herlaadt de pagina
  const handleResetProgress = () => {
    localStorage.removeItem("les1-install-card-checked");
    localStorage.removeItem("les1-quiz-index");
    localStorage.removeItem("les1-quiz-finished");
    window.location.reload();
  };

  return (
    // We wikkelen nu alles in onze nieuwe GradientBackground component!
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
        {/* DEBUG KNOP */}
        <div className="d-flex justify-content-end mb-3">
          <button 
            onClick={handleResetProgress} 
            className="btn btn-sm btn-danger shadow-sm"
            style={{ borderRadius: "10px" }}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Debug: Reset Voortgang
          </button>
        </div>

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
              cardId="les1-install-card" // Toegevoegd zodat we de juiste resetten
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
              completionReward={30} // Voegt 30 valuta toe en toont de eindanimatie
            />
        </div>

        <ContentSection>
          <p>
            Belangrijk is ook nog dat je een account nodig hebt om Roblox te spelen of spellen te maken.
          </p>
          <p>
            Vraag gerust aan een ouder of verzorger om je te helpen een account aan te maken als je dat nog niet hebt gedaan! (En natuurlijk alleen als je toestemming hebt van een ouder of verzorger!).
          </p>
          <p>
            Onthoud je wachtwoord en gebruikersnaam goed, want die heb je nodig om in te loggen op Roblox Studio en Roblox Player!
          </p>
        </ContentSection>

          <ContentSection
  title="Roblox Player Opstarten en Verkennen"
  contentBlocks={[
    {
      // BLOCK 1
      textAbove: <p>Nadat de applicatie geïnstalleerd is, zie je dit scherm!</p>,
      imageSrc: ImageLoggedIn,
      imageAlt: "Roblox Player Ingelogd",
      imageCaption: "De Roblox homepagina",
      textBelow: <p>In de volgende les gaan we samen een Obby maken, dus zorg ervoor dat je Roblox Studio hebt geïnstalleerd en klaar staat om te leren!</p>
    },
    {
      // BLOCK 2
      textAbove: <p>Nadat we daar klaar mee zijn is het tijd om inspiratie te zoeken door bestaande obbies te bekijken!</p>,
      imageSrc: EscapeTWO, // Je tweede afbeelding
      imageAlt: "Escape The World Obby",
      imageCaption: "Een voorbeeld van een populaire Obby",
      textBelow: <p>In de volgende les zullen we Roblox Studio opzetten en leren gebruiken!</p>
    }
  ]}
/>

          <LessonQuiz
            quizId="les1-quiz"
            questions={quizQuestions}
            balanceGainAmount={50}
          />

          <EndOfLesson 
          nextLessonPath="/GMHelden1/les-2"
            dashboardPath="/GMHelden1" 
          />
       </div>
    </GradientBackground>
  );
}