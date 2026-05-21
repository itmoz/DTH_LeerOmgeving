import React from "react";
import ProgressCheckmarkCard from "../../WebsiteElements/Card/ProgressCheckmarkCard.jsx";
import MissionBoard from "../../WebsiteElements/LessonContent/MissionBoard.jsx";
import ContentSection from "../../WebsiteElements/LessonContent/ContentSection.jsx";
import ImageRobloxStudioStartup from "../../Images/LesAfbeeldingen/GMHelden1/Les2/DTH1Les2Img1.png";
import LessonQuiz from "../../WebsiteElements/LessonContent/LessonQuiz.jsx";
import EndOfLesson from "../../WebsiteElements/LessonContent/EndOfLesson.jsx";

import GradientBackground from "../../WebsiteElements/BackgroundGradient/GradientBackground.jsx";
import VideoPlayer from "../../WebsiteElements/ImagesAndVideos/VideoPlayer.jsx";
import GIFPlayer from "../../WebsiteElements/ImagesAndVideos/GIFPlayer.jsx";

import LoadingObby from "../../Video/GMHelden1/Les3/ObbyInladen.mp4";
import DuplicatingPlatforms from "../../Video/GMHelden1/Les3/DGMH1_Clip13.mp4";
import ColoringPlatforms1 from "../../Video/GMHelden1/Les3/DGMH1_Clip14.mp4";
import ColoringPlatforms2 from "../../Video/GMHelden1/Les3/DGMH1_Clip15.mp4";

export default function GmHelden1Lesson3() {
  const lessonGoals = [
    "🎨 Hoe geef je kleur aan je platforms?",
    "🧰 Wat is de toolbox en hoe gebruik je die?",
    "🧱 Hoe maak je een kill block (lava blok)?",
    "✅ Hoe maak je een checkpoint?",
  ];

  const quizQuestions = [
    {
      id: 1,
      type: "multiple-choice",
      question:
        "Waar kan je spel elementen vinden gemaakt door andere gebruikers?",
      options: ["In de toolbox", "In de explorer", "In de properties"],
      correctAnswer: "In de toolbox",
    },
    {
      id: 2,
      type: "text-input",
      question: "Hoe laden we ons spel in Roblox Studio?",
      correctAnswer: [
        "recent experiences",
        "home",
        "recent",
        "recents",
        "recente",
        "ervaringen",
        "experiences",
        "recente ervaringen",
      ],
    },
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
          Kleur, Toolbox & Checkpoints
        </h1>

        <MissionBoard goals={lessonGoals} />

        {/* --- CONTENT SECTIONS --- */}
        <ContentSection
          title="Het inladen van je spel!"
          contentBlocks={[
            {
              textAbove: (
                <p>
                  Als je gelijk verder gaat van de vorige les zonder je spel
                  afgesloten te hebben kan je deze stap overslaan, maar als je
                  Roblox Studio opnieuw opent moet je natuurlijk weer je spel
                  inladen! Gelukkig is dat heel makkelijk.
                  <br />
                  <br />
                  Je gaat naar "Recent" of "Experiences" en daar klik je op het
                  spel dat we in de vorige les gemaakt hebben. En tadaa, je bent
                  weer in je spel!
                </p>
              ),
              customElement: (
                <VideoPlayer
                  src={LoadingObby}
                  title="Je Obby inladen in Roblox Studio"
                  style={{ width: "100%", height: "auto" }}
                />
              ),
            },
          ]}
        />

        <ContentSection
          title="Pro tip!: Snel platformen dupliceren!"
          contentBlocks={[
            {
              textAbove: (
                <p>
                  In de vorige les hebben we geleerd hoe we met "Parts"
                  platformen kunnen maken. Maar als we dit de heletijd handmatig
                  moeten doen kan dat best wel lang duren
                  <br />
                  <br />
                  Gelukkig zijn er een paar manieren om dit proces te
                  versnellen! Door in de explorer op je part te klikken kan je
                  met rechter muisknop op de naam klikken en verschijnt de optie
                  "Duplicate". Als je hierop klikt maakt Roblox Studio een
                  exacte kopie van je part, die je dan weer kan verplaatsen en
                  aanpassen.
                  <br />
                  <br />
                  We kunnen dit ook via ons toetsenbord doen door op het
                  platform te klikken dat we willen kopiëren en vervolgens de
                  toetsen "Ctrl + D" (of "Cmd + D" op Mac) in te drukken. Dit
                  zal ook een exacte kopie van het geselecteerde platform maken,
                  die je dan weer kan verplaatsen en aanpassen.
                </p>
              ),
              customElement: (
                <VideoPlayer
                  src={DuplicatingPlatforms}
                  title="Snel platformen dupliceren in Roblox Studio"
                  style={{ width: "100%", height: "auto" }}
                />
              ),
            },
          ]}
        />

        <ContentSection
          title="Kleur geven aan je platforms!"
          contentBlocks={[
            {
              textAbove: (
                <p>
                  Je platforms zien er nu nog een beetje saai uit, maar gelukkig
                  kunnen we ze makkelijk een kleurtje geven!
                  <br />
                  <br />
                  Om dit te doen selecteren we een platform door er op te
                  klikken in je game wereld of in de explorer onder "Workspace".
                  <br />
                  <br />
                  Vervolgens kunnen we boven met de "Color" knop de kleur
                  aanpassen door het kleine witte pijltje naast "Color" te
                  klikken, een kleur te kiezen en daarna weer op de "Color" knop
                  te klikken. Het ziet er zo uit.
                </p>
              ),
              customElement: (
                <VideoPlayer
                  src={ColoringPlatforms1}
                  title="Kleur geven aan je platforms in Roblox Studio"
                  style={{ width: "100%", height: "auto" }}
                />
              ),
              textBelow: (
                <p>
                  Als we bij een ander platform een andere kleur willen kunnen
                  we deze stappen gewoon herhalen. Zo kunnen we makkelijk
                  verschillende kleuren aan onze platforms geven!
                </p>
              ),
            },
            {
              customElement: (
                <VideoPlayer
                  src={ColoringPlatforms2}
                  title="Kleur geven aan je platforms in Roblox Studio"
                  style={{ width: "100%", height: "auto" }}
                />
              ),
            },
          ]}
        />

        {/* -------------------------------------- */}

        <LessonQuiz
          quizId="3"
          questions={quizQuestions}
          balanceGainAmount={30}
        />

        <EndOfLesson
          prevLessonPath="/GMHelden1/les-2"
          nextLessonPath="/GMHelden1/les-4"
          dashboardPath="/GMHelden1"
        />
      </div>
    </GradientBackground>
  );
}
