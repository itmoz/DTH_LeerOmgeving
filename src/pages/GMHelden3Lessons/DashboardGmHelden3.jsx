import React from "react";
import { useNavigate } from "react-router-dom";
import LessonCard from "../../WebsiteElements/Card/LessonCard.jsx"; // Controleer of dit pad klopt

/**
 * @typedef {object} Lesson
 * @property {string} title - De titel van de les.
 * @property {string} text - Een korte beschrijving van de les.
 * @property {string} imageUrl - De URL voor de banner van de lescard.
 * @property {boolean} completed - Of de les is voltooid of niet.
 * @property {function} buttonAction - Een functie die wordt uitgevoerd wanneer op de knop wordt geklikt.
 */

/**
 * @typedef {object} LessonData
 * @property {Lesson[]} general - De eerste twee algemene lessen (Les 1 & 2).
 * @property {object} skillTree - De lessen georganiseerd per skill-tree-tak.
 * @property {Lesson[]} skillTree.gameDesign - De Game Design-lessen.
 * @property {Lesson[]} skillTree.levelDesign - De Level Design-lessen.
 * @property {Lesson[]} skillTree.programmingEssentials - De Programming Essentials-lessen.
 */

// --- 1. DE LES-DATA ---
/**
 * De volledige set lesson-data voor GMHelden3.
 * Deze data is gemakkelijk aan te passen of uit te breiden.
 * @type {LessonData}
 */
const lessonDataGMHelden3 = {
  general: [
    {
      title: "Les 1 GMHelden3: Introductie tot Roblox Game Maken!",
      text: "Een introductie tot het maken van je eigen Roblox game met als eindresultaat een Obby!",
      imageUrl: "https://picsum.photos/800/300?random=1",
      completed: true,
      buttonAction: (navigate) => navigate("/GMHelden3/les-1"),
    },
    {
      title: "Les 2 GMHelden3: Obby Mechanics!",
      text: "Leer hoe je checkpoints en killbricks maakt voor je Obby.",
      imageUrl: "https://picsum.photos/800/300?random=2",
      completed: false,
      buttonAction: (navigate) => navigate("/GMHelden3/les-2"),
    },
  ],
  skillTree: {
    gameDesign: [
      {
        title: "GD Les 1: Game Design Documentatie",
        text: "Maak een GDD voor je game.",
        imageUrl: "https://picsum.photos/800/300?random=3",
        completed: false,
        buttonAction: (navigate) => navigate("/GMHelden3/les-gd-1"),
      },
      {
        title: "GD Les 2: Game Balancing",
        text: "Maak je game uitdagender.",
        imageUrl: "https://picsum.photos/800/300?random=4",
        completed: false,
        buttonAction: (navigate) => navigate("/GMHelden3/les-gd-2"),
      },
    ],
    levelDesign: [
      {
        title: "LD Les 1: Level Structuur",
        text: "Maak een level dat leuk en logisch is.",
        imageUrl: "https://picsum.photos/800/300?random=5",
        completed: false,
        buttonAction: (navigate) => navigate("/GMHelden3/les-ld-1"),
      },
      {
        title: "LD Les 2: Level Thema en Sfeer",
        text: "Voeg decoraties toe aan je level.",
        imageUrl: "https://picsum.photos/800/300?random=6",
        completed: false,
        buttonAction: (navigate) => navigate("/GMHelden3/les-ld-2"),
      },
    ],
    programmingEssentials: [
      {
        title: "PE Les 1: Variabelen",
        text: "Maak een muntensysteem.",
        imageUrl: "https://picsum.photos/800/300?random=7",
        completed: false,
        buttonAction: (navigate) => navigate("/GMHelden3/les-pe-1"),
      },
      {
        title: "PE Les 2: Functies",
        text: "Maak een winkelsysteem.",
        imageUrl: "https://picsum.photos/800/300?random=8",
        completed: false,
        buttonAction: (navigate) => navigate("/GMHelden3/les-pe-2"),
      },
    ],
  },
};

// --- 2. HERBRUIKBARE SUB-COMPONENTEN ---
/**
 * Een component dat een verticale lijst van LessonCards weergeeft.
 * @component
 * @param {object} props
 * @param {Lesson[]} props.lessons - De lijst van lessen om weer te geven.
 */
const LessonListVertical = ({ lessons }) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column gap-4">
      {lessons.map((lesson, index) => (
        <LessonCard
          key={index}
          title={lesson.title}
          text={lesson.text}
          imageUrl={lesson.imageUrl}
          completed={lesson.completed}
          buttonAction={() => lesson.buttonAction(navigate)}
        />
      ))}
    </div>
  );
};

/**
 * Een component dat de skill-tree takken en hun lessen weergeeft.
 * @component
 * @param {object} props
 * @param {object} props.skillTreeData - De lesson-data georganiseerd per tak. test
 */
const SkillTreeLayout = ({ skillTreeData }) => {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-4 mb-4">
        <h3 className="text-center">Game Design</h3>
        <LessonListVertical lessons={skillTreeData.gameDesign} />
      </div>
      <div className="col-12 col-md-4 mb-4">
        <h3 className="text-center">Level Design</h3>
        <LessonListVertical lessons={skillTreeData.levelDesign} />
      </div>
      <div className="col-12 col-md-4 mb-4">
        <h3 className="text-center">Player Engineer</h3>
        <LessonListVertical lessons={skillTreeData.programmingEssentials} />
      </div>
    </div>
  );
};

// --- 3. HET HOOFDCOMPONENT ---
/**
 * Het dashboard voor GMHelden3 lessen met een skill-tree layout.
 * @component
 */
const DashboardGmHelden3 = () => {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">GMHelden3 Lessen - Skill Tree</h2>

      {/* Verticale sectie voor de eerste twee algemene lessen (net als dashboardgmhelden1) */}
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-lg-8">
          <h3 className="text-center">De Basis</h3>
          <LessonListVertical lessons={lessonDataGMHelden3.general} />
        </div>
      </div>

      {/* De Skill Tree sectie die hieronder begint en zich splitst */}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-12">
          <h3 className="text-center mb-4">De padden</h3>
          <SkillTreeLayout skillTreeData={lessonDataGMHelden3.skillTree} />
        </div>
      </div>
    </div>
  );
};

export default DashboardGmHelden3;
