import React from "react";
import ProgressCheckmarkCard from "../../WebsiteElements/Card/ProgressCheckmarkCard.jsx";
import MissionBoard from "../../WebsiteElements/LessonContent/MissionBoard.jsx";
import ContentSection from "../../WebsiteElements/LessonContent/ContentSection.jsx";
import ImageRobloxStudioStartup from "../../Images/LesAfbeeldingen/GMHelden1/Les2/DTH1Les2Img1.png";
import LessonQuiz from "../../WebsiteElements/LessonContent/LessonQuiz.jsx";
import EndOfLesson from "../../WebsiteElements/LessonContent/EndOfLesson.jsx";

import GradientBackground from "../../WebsiteElements/BackgroundGradient/GradientBackground.jsx";
import VideoPlayer from "../../WebsiteElements/ImagesAndVideos/VideoPlayer.jsx";

import CreatingStudioEnv from "../../Video/GMHelden1/Les2/DGMH1_Clip1.mp4";

export default function GmHelden1Lesson2() {

   const lessonGoals = [
  "🎯 Het maken van een werkomgeving in Roblox Studio",
  "🧰 De basis tools in Roblox Studio leren kennen",
  "🧩 Leren hoe je een simpel platform maakt",
  "✨ Gereedschappen om je platformen leuker te maken ontdekken",
  "📍 Een spawnpoint toevoegen waar spelers beginnen",
  "🕹️ Het testen van je spel in Roblox Studio!"
];

  const quizQuestions = [
    {
      id: 1,
      type: "multiple-choice",
      question: "Welke van deze is GEEN onderdeel van de Roblox Studio interface?",
      options: ["Explorer", "Properties", "Toolbox", "Inventory"],
      correctAnswer: "Inventory"
    },
    {
      id: 2,
      type: "text-input",
      question: "Wat is de naam van de tool waarmee je objecten in Roblox Studio kunt verplaatsen? (Typ het woord)",
      correctAnswer: ["move tool", "move", "verplaats tool", "verplaats", "moven", "verplaatsen"]
    },
    {
      id: 3,
      type: "text-input",
      question: "Hoe zorgen we ervoor dat blokjes in de lucht blijven in plaats van naar beneden vallen?",
      correctAnswer: ["anchor", "anker", "anchor tool", "anker tool", "het anchored maken", "het anchored maken van de blokjes", "door het te anchoren", "door het te anchoren"]
    }
  ];

  return (
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
          GmHelden1Lesson2
        </h1>

        
        <MissionBoard goals={lessonGoals} />

        <ContentSection title="Hoe installeer je Roblox Studio?">
        <p>
        In de vorige les hebben we geleerd wat Roblox is en hoe je het op je computer kunt spelen. Nu gaan we een stap verder en installeren we Roblox Studio, de tool waarmee we onze eigen games kunnen maken!
        </p>
        <p>
          Roblox studio kan je downloaden van de officiële Roblox website met het de volgende link <a href="https://www.roblox.com/download/studio" target="_blank" rel="noopener noreferrer">https://www.roblox.com/download/studio</a>
        </p>
        <p>
          Nadat we de download hebben voltooid en op het geinstalleerde programma hebben geklikt zal Roblox Studio automatisch openen en zien we dit scherm:
        </p>
      </ContentSection>

        <ContentSection title="Het maken van de werkomgeving!"
        
        contentBlocks={[
          {
            textAbove: <p>Nu we Roblox Studio hebben geïnstalleerd, is het tijd om onze werkomgeving op te zetten! We gaan een simpel platform maken waar spelers op kunnen springen. Laten we beginnen!</p>,
            imageSrc: ImageRobloxStudioStartup,
            imageAlt: "Roblox Studio Startscherm",
            imageCaption: "Het startscherm van Roblox Studio",
            textBelow: <p> Dit is wat je voor het eerst zien nadat je Roblox Studio hebt geïnstalleerd en ingelogd bent!</p>
          },
          {
            textAbove: <p>Om een nieuw project te starten, klik op 'New' en kies 'Baseplate'. Dit geeft ons een leeg canvas om op te bouwen!</p>,
          },
          // FIX: Pass the VideoPlayer inside a content object under a new key
          {
            customElement: (
              <VideoPlayer
                src={CreatingStudioEnv}
                title="Het maken van een werkomgeving in Roblox Studio"
                width="100%"
               />
            )
          }
        ]}/>

        <EndOfLesson 
          prevLessonPath="/GMHelden1/les-1"
          nextLessonPath="/GMHelden1/les-3"
          dashboardPath="/GMHelden1" 
        />

      </div>
    </GradientBackground>
  );
}