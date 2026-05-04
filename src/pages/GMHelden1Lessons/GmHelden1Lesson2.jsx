import React from "react";
import ProgressCheckmarkCard from "../../WebsiteElements/Card/ProgressCheckmarkCard.jsx";
import MissionBoard from "../../WebsiteElements/LessonContent/MissionBoard.jsx";
import ContentSection from "../../WebsiteElements/LessonContent/ContentSection.jsx";
import ImageLoggedIn from "../../Images/LesAfbeeldingen/GMHelden1/Les1/GmHeldenLes1AfbeeldingIngelogd.png";
import LessonQuiz from "../../WebsiteElements/LessonContent/LessonQuiz.jsx";
import EndOfLesson from "../../WebsiteElements/LessonContent/EndOfLesson.jsx";

import GradientBackground from "../../WebsiteElements/BackgroundGradient/GradientBackground.jsx";

export default function GmHelden1Lesson2() {

   const lessonGoals = [
    " Het maken van een werkomgeving in Roblox Studio",
    " De basis tools in Roblox Studio leren kennen",
    " Leren hoe je een simpel platform maakt",
    " Gereedschappen om je platformen leuker te maken ontdekken",
    " Een spawnpoint toevoegen waar spelers beginnen",
    " Het testen van je spel in Roblox Studio!"
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














}

