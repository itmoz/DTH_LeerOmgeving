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

import CreatingStudioEnv from "../../Video/GMHelden1/Les2/DGMH1_Clip1.mp4";
import PlacingPartsGIF from "../../GIFS/GMHelden1Lessons/Les2/DGMH1_Clip2.gif";
import MovingParts from "../../Video/GMHelden1/Les2/DGMH1_Clip3.mp4";
import DisplayingZoomAndMoveCamera from "../../GIFS/GMHelden1Lessons/Les2/DGMH1_Clip4.gif";
import ScalingParts from "../../Video/GMHelden1/Les2/DGMH1_Clip5.mp4";
import RotatingParts from "../../Video/GMHelden1/Les2/DGMH1_Clip6.mp4";
import DeletingBaseplateDel from "../../Video/GMHelden1/Les2/DGMH1_Clip7.mp4";
import DeletingBaseplateMenu from "../../Video/GMHelden1/Les2/DGMH1_Clip8.mp4"; // make this a GIF later
import PlayingGame from "../../Video/GMHelden1/Les2/DGMH1_Clip9.mp4";
import PausingGame from "../../Video/GMHelden1/Les2/DGMH1_Clip10.mp4";
import StoppingGameWithFallingBlock from "../../Video/GMHelden1/Les2/DGMH1_Clip11.mp4";
import AnchoringParts from "../../Video/GMHelden1/Les2/DGMH1_Clip12.mp4";
import SavingObby from "../../Video/GMHelden1/Les2/ObbyOpslaan.mp4";

export default function GmHelden1Lesson2() {
  const lessonGoals = [
    "🎯 Het maken van een werkomgeving in Roblox Studio",
    "🧰 De basis tools in Roblox Studio leren kennen",
    "🧩 Leren hoe je een simpel platform maakt",
    "🕹️ Het testen van je spel in Roblox Studio!",
  ];

  const quizQuestions = [
    {
      id: 1,
      type: "multiple-choice",
      question:
        "Welke van deze is GEEN onderdeel van de Roblox Studio interface?",
      options: ["Explorer", "Properties", "Toolbox", "Inventory"],
      correctAnswer: "Inventory",
    },
    {
      id: 3,
      type: "text-input",
      question:
        "Wat is de naam van de tool waarmee je objecten in Roblox Studio kunt verplaatsen? (Typ het woord)",
      correctAnswer: [
        "move tool",
        "move",
        "verplaats tool",
        "verplaats",
        "moven",
        "verplaatsen",
      ],
    },
    {
      id: 2,
      type: "text-input",
      question:
        "Hoe zorgen we ervoor dat blokjes in de lucht blijven in plaats van naar beneden vallen?",
      correctAnswer: [
        "anchor",
        "anker",
        "anchor tool",
        "anker tool",
        "het anchored maken",
        "het anchored maken van de blokjes",
        "door het te anchoren",
        "door het te anchoren",
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
          GmHelden1Lesson2
        </h1>

        <MissionBoard goals={lessonGoals} />

        <ContentSection title="Hoe installeer je Roblox Studio?">
          <p>
            In de vorige les hebben we geleerd wat Roblox is en hoe je het op je
            computer kunt spelen. Nu gaan we een stap verder en installeren we
            Roblox Studio, de tool waarmee we onze eigen games kunnen maken!
          </p>
          <p>
            Roblox studio kan je downloaden van de officiële Roblox website met
            het de volgende link{" "}
            <a
              href="https://www.roblox.com/download/studio"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.roblox.com/download/studio
            </a>
          </p>
          <p>
            Nadat we de download hebben voltooid en op het geinstalleerde
            programma hebben geklikt zal Roblox Studio automatisch openen en
            zien we dit scherm:
          </p>
        </ContentSection>

        <ContentSection
          title="Het maken van de werkomgeving!"
          contentBlocks={[
            {
              textAbove: (
                <p>
                  Nu we Roblox Studio hebben geïnstalleerd, is het tijd om onze
                  werkomgeving op te zetten! We gaan een simpel platform maken
                  waar spelers op kunnen springen. Laten we beginnen!
                </p>
              ),
              imageSrc: ImageRobloxStudioStartup,
              imageAlt: "Roblox Studio Startscherm",
              imageCaption: "Het startscherm van Roblox Studio",
              textBelow: (
                <p>
                  {" "}
                  Dit is wat je voor het eerst zien nadat je Roblox Studio hebt
                  geïnstalleerd en ingelogd bent!
                </p>
              ),
            },
            {
              textAbove: (
                <p>
                  Om een nieuw project te starten, klik op 'New' en kies
                  'Baseplate'. Dit geeft ons een leeg canvas om op te bouwen!
                </p>
              ),
            },
            // FIX: Pass the VideoPlayer inside a content object under a new key
            {
              customElement: (
                <VideoPlayer
                  src={CreatingStudioEnv}
                  title="Het maken van een werkomgeving in Roblox Studio"
                  style={{ width: "100%", height: "auto" }}
                />
              ),
            },
          ]}
        />

        <ContentSection
          title="Het plaatsen van objecten"
          contentBlocks={[
            {
              textAbove: (
                <p>
                  We hebben nu een leeg speelveld. Maar de spelers moeten ergens
                  op komen te staan, dus gaan we ons eerste platform maken!
                  <br />
                  <br />
                  Deze keer kijken we naar de balk aan de bovenkant van het
                  scherm. We willen dan klikken op de knop “Part” in deze balk.
                  Je kan het hier vinden:
                </p>
              ),
              customElement: (
                <GIFPlayer
                  src={PlacingPartsGIF}
                  alt="GIF van het plaatsen van een part in Roblox Studio"
                  width="100%"
                  aspectRatio="16/9"
                />
              ),
            },
            {
              textAbove: (
                <p>
                  Wat belangrijk is om te weten is hoe we kunnen rondkijken in
                  Roblox Studio. Door de rechter muisknop op je muis or een
                  trackpad te houden en te bewegen kunnen we rondkijken in onze
                  werkomgeving.
                  <br />
                  <br />
                  Om te bewegen in onze werkomgeving kan je de WASD toetsen of
                  de pijltoetsen gebruiken terwijl je de rechter muisknop
                  ingedrukt houdt.
                  <br />
                  <br />
                  Ook kan je met de scrollknop van je muis in en uitzoomen.
                  Probeer dit allemaal eens uit terwijl je rondkijkt in je
                  werkomgeving!
                </p>
              ),
              customElement: (
                <GIFPlayer
                  src={DisplayingZoomAndMoveCamera}
                  alt="GIF van het bewegen en zoomen in Roblox Studio"
                  width="100%"
                  aspectRatio="16/9"
                />
              ),
            },
          ]}
        />

        <ContentSection
          title={"Het manipuleren van platforms"}
          contentBlocks={[
            {
              textAbove: (
                <p>
                  We kunnen nu een platform zien in onze werkomgeving, Wanneer
                  we een blokje plaatsen zien we dat "Workspace" openklapt in de
                  "Explorer" aan de rechterkant van het scherm. Hier kunnen we
                  al onze objecten zien die in onze werkomgeving staan. <br />
                  <br />
                  We kunnen een aantal dingen doen om ons platform te
                  manipuleren, om te beginnen kunnen we het platform selecteren
                  door erop te klikken en vervolgens links boven in de balk op
                  de "Move" te klikken. Hiermee kunnen we het platform
                  verplaatsen door de pijlen die verschijnen te slepen
                  <br />
                </p>
              ),
              customElement: (
                <VideoPlayer
                  src={MovingParts}
                  title="Het verplaatsen van objecten in Roblox Studio"
                  style={{ width: "100%", height: "auto" }}
                />
              ),
            },
            {
              textAbove: (
                <p>
                  Als je op 'Scale' drukt, en dan op het blokje in het game
                  scherm, dan zie je een hoop gekleurde bolletjes verschijnen.
                  <br />
                  <br />
                  Je kan deze bolletjes klikken en slepen om zo de vorm van het
                  blokje te veranderen!
                  <br />
                  <br />
                  Zo ziet dat eruit:
                </p>
              ),
              customElement: (
                <VideoPlayer
                  src={ScalingParts}
                  title="Het schalen van objecten in Roblox Studio"
                  style={{ width: "100%", height: "auto" }}
                />
              ),
            },
            {
              textAbove: (
                <p>
                  'Rotate' is het engelse woord voor 'Draaien'. Als je deze tool
                  selecteert en op een object klikt, verschijnen er nu cirkels
                  rond het object.
                  <br />
                  <br />
                  Door deze cirkels te slepen kun je het object draaien!
                </p>
              ),
              customElement: (
                <VideoPlayer
                  src={RotatingParts}
                  title="Het roteren van objecten in Roblox Studio"
                  style={{ width: "100%", height: "auto" }}
                />
              ),
            },
          ]}
        />

        <div className="w-100">
          <ProgressCheckmarkCard
            cardId="les1-install-card" // Toegevoegd zodat we de juiste resetten
            title="De eerste stapjes in Roblox Studio"
            items={[
              { id: 1, text: "Roblox Studio opgezet", checked: false },
              { id: 2, text: "Een platform geplaatst", checked: false },
              { id: 3, text: "Het platform verplaatst", checked: false },
              { id: 4, text: "Het platform geschaald", checked: false },
              { id: 5, text: "Het platform geroteerd", checked: false },
            ]}
            iconPosition="end"
            bgColor="#fff9c4"
            headingColor="#f57f17"
            itemPadding="0.75rem 0"
            completionReward={20}
          />
        </div>

        <ContentSection
          title={"Het verwijderen van de baseplate"}
          contentBlocks={[
            {
              textAbove: (
                <p>
                  De baseplate is het grote vlak dat in het midden van je
                  werkomgeving staat. Het is een soort van "grond" waarop je
                  dingen kunt bouwen.
                  <br />
                  <br />
                  Omdat we een obby gaan maken willen we dat onze spelers kunnen
                  vallen, dus we willen deze baseplate verwijderen zodat er niks
                  onder onze platforms is.
                  <br />
                  <br />
                  Er zijn twee manieren om dit te doen:
                  <br />
                  <br />
                  1. Je kan het baseplate selecteren in de "Explorer" aan de
                  rechterkant van het scherm, en dan op de "Delete" of
                  "Backspace" toets op je toetsenbord drukken.
                  <br />
                  <br />
                  2. Je kan het baseplate selecteren in de "Explorer", en dan
                  rechts klikken en "Delete" kiezen in het menu dat verschijnt.
                </p>
              ),
              customElement: (
                <>
                  <VideoPlayer
                    src={DeletingBaseplateDel}
                    title="Het verwijderen van de baseplate met de Delete toets"
                    style={{ width: "100%", height: "auto" }}
                  />
                  <VideoPlayer
                    src={DeletingBaseplateMenu}
                    title="Het verwijderen van de baseplate met het menu"
                    style={{ width: "100%", height: "auto", marginTop: "1rem" }}
                  />
                </>
              ),
            },
          ]}
        />

        <div className="w-100">
          <ProgressCheckmarkCard
            cardId="les1-install-card" // Toegevoegd zodat we de juiste resetten
            title="Het verwijderen van de baseplate"
            items={[{ id: 1, text: "Baseplate verwijderd", checked: false }]}
            iconPosition="end"
            bgColor="#fff9c4"
            headingColor="#f57f17"
            itemPadding="0.75rem 0"
            completionReward={5}
          />
        </div>

        <ContentSection
          title={"Het testen van je spel!"}
          contentBlocks={[
            {
              textAbove: (
                <p>
                  Nu je weet hoe je objecten kunt manipuleren, is het tijd om je
                  spel te testen! Klik op de "Play" knop in de bovenste balk van
                  Roblox Studio om je spel te starten.
                </p>
              ),
              customElement: (
                <>
                  <VideoPlayer
                    src={PlayingGame}
                    title="Het spelen van je spel in Roblox Studio"
                    style={{ width: "100%", height: "auto" }}
                  />
                </>
              ),
            },
            {
              textAbove: (
                <p>
                  Tijdens het spelen van je spel, kun je op de "Pause" knop
                  klikken om het spel te pauzeren.
                </p>
              ),
              customElement: (
                <>
                  <VideoPlayer
                    src={PausingGame}
                    title="Het pauzeren van je spel in Roblox Studio"
                    style={{ width: "100%", height: "auto" }}
                  />
                </>
              ),
            },
            {
              textAbove: (
                <p>
                  Om het testen van je spel te stoppen, klik op de rode vierkant
                  linksboven in de balk. Je zult zien dat je weer terug bent in
                  de bewerkmodus van Roblox Studio.
                </p>
              ),
              customElement: (
                <>
                  <VideoPlayer
                    src={StoppingGameWithFallingBlock}
                    title="Het stoppen van het testen van je spel in Roblox Studio"
                    style={{ width: "100%", height: "auto" }}
                  />
                </>
              ),
              textBelow: (
                <p>
                  Als je net scherp oplette zag je dat het platform wat we
                  hadden gemaakt begon te vallen toen we op 'Play' klikten.
                  <br />
                  <br />
                  Dat komt omdat we het platform nog niet 'anchored' /
                  'geankerd' hebben, wat betekent dat het niet vast staat en dus
                  naar beneden valt.
                </p>
              ),
            },
          ]}
        />

        <ContentSection
          title={"Het ankeren van objecten"}
          contentBlocks={[
            {
              textAbove: (
                <p>
                  Om te voorkomen dat onze platforms naar beneden vallen, moeten
                  we ze 'anchoren'. Dit betekent dat we ze vastzetten zodat ze
                  niet bewegen.
                  <br />
                  <br />
                  Om een object te ankeren selecteren we het in de wereld en
                  kunnen we in de taakbalk bovenin op de "Anchor" knop klikken.
                  Deze knop ziet eruit als een anker en bevindt zich in dezelfde
                  balk als de "Move", "Scale" en "Rotate" knoppen.
                </p>
              ),
              customElement: (
                <VideoPlayer
                  src={AnchoringParts}
                  title="Het ankeren van objecten in Roblox Studio"
                  style={{ width: "100%", height: "auto" }}
                />
              ),
            },
          ]}
        />

        <div>
          <ProgressCheckmarkCard
            cardId="les1-install-card" // Toegevoegd zodat we de juiste resetten
            title="Het ankeren van objecten"
            items={[{ id: 1, text: "Objecten geankerd", checked: false }]}
            iconPosition="end"
            bgColor="#fff9c4"
            headingColor="#f57f17"
            itemPadding="0.75rem 0"
            completionReward={10}
          />
        </div>

        <ContentSection
          title={"Het opslaan van je werk!"}
          contentBlocks={[
            {
              textAbove: (
                <p>
                  Vergeet niet om regelmatig je werk op te slaan! Je kunt dit
                  doen door op "File" te klikken in de bovenste balk en
                  vervolgens "Save to Roblox", zo wordt je project opgeslagen op
                  je Roblox account en kun je er later weer aan werken vanaf
                  elke computer!
                </p>
              ),
              customElement: (
                <VideoPlayer
                  src={SavingObby} // Je kunt hier een andere video of GIF plaatsen die het opslaan van werk laat zien
                  title="Het opslaan van je werk in Roblox Studio"
                  style={{ width: "400%", height: "auto" }}
                />
              ),
            },
          ]}
        />

        <LessonQuiz
          quizId="3"
          questions={quizQuestions}
          balanceGainAmount={30}
        />

        <EndOfLesson
          prevLessonPath="/GMHelden1/les-1"
          nextLessonPath="/GMHelden1/les-3"
          dashboardPath="/GMHelden1"
        />
      </div>
    </GradientBackground>
  );
}
