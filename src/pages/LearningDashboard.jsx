import React from 'react';
import CustomCard from '../WebsiteElements/Card/CustomCard.jsx';
import CurriculumCard from '../WebsiteElements/Card/CurriculumCard.jsx';
import { useNavigate } from 'react-router-dom';

import DataMiniGameBanner from '../Images/DataMinigameBanner.png';
import GmHelden1CurriculumCard from '../Images/CurriculumcardGMhelden1.png';

// this file is in src/pages/LearningDashboard.jsx

const LearningDashboard = () => {
  const navigate = useNavigate();
  const continueLessonButtonText = "Continue Lesson";
  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Curriculums</h2>
      
      {/* The 'row' class creates the grid, and 'g-4' adds even gaps between the cards */}
      <div className="row g-4 justify-content-center">

        {/* Card 5: Curriculum Progress */}
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
          <CurriculumCard
            title="Beginner Roblox Game Maken!"
            text="Een introductie tot het maken van je eigen Roblox game met als eind resultaat een Obby!"
            imageUrl= {GmHelden1CurriculumCard}
            progress={0} // In the future get this number from backend
            buttonText= {continueLessonButtonText}
            buttonAction={() => navigate("/GMHelden1")}
          />
        </div>


        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
          <CurriculumCard
            title="De Nieuws Helden!"
            text= "Aliens proberen low-poly city over te nemen door nieuwsbronnen over te nemen en te vullen met misinformatie! Vernietig het slechte nieuws door het door midden te hakken voordat het de radio toren kan bereiken! Maar wees op je hoeden, de inwoners moeten wel op de hoogte gehouden worden met de huidige situatie, dus zorg ervoor dat het echte nieuws niet vernietigt wordt!"
            imageUrl= {DataMiniGameBanner}
            buttonText={"Speel nu!"}
            buttonAction={() => window.open("https://martijn2410.github.io/Data-Minigame/", "_blank")}
          />
        </div>

      </div>
    </div>
  );
};

export default LearningDashboard;