import React from 'react';
import CustomCard from '../WebsiteElements/Card/CustomCard.jsx';
import CurriculumCard from '../WebsiteElements/Card/CurriculumCard.jsx';

const LearningDashboard = () => {
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
            imageUrl="https://picsum.photos/300/200?random=3"
            progress={1} // In the future get this number from backend
            buttonText="Continue Lesson"
            buttonAction={() => console.log("Lesson opened")}
          />
        </div>

        {/* Card 5: Curriculum Progress */}
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
          <CurriculumCard
            title="Gevorderd Roblox Game Maken!"
            text="Maak een spannende avontuur game met gevechten, puzzels en meer!"
            imageUrl="https://picsum.photos/300/200?random=3"
            progress={50} // In the future get this number from backend
            buttonText="Continue Lesson"
            buttonAction={() => console.log("Lesson opened")}
          />
        </div>

        {/* Card 5: Curriculum Progress */}
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
          <CurriculumCard
            title="Game Design principes met Roblox!"
            text="Roblox Game Makers: Obby!"
            imageUrl="https://picsum.photos/300/200?random=3"
            progress={30} // In the future get this number from backend
            buttonText="Continue Lesson"
            buttonAction={() => console.log("Lesson opened")}
          />
        </div>

        {/* Card 5: Curriculum Progress */}
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
          <CurriculumCard
            title="Visual Card"
            text="Roblox Game Makers: Obby!"
            imageUrl="https://picsum.photos/300/200?random=3"
            progress={60} // In the future get this number from backend
            buttonText="Continue Lesson"
            buttonAction={() => console.log("Lesson opened")}
          />
        </div>

        {/* Card 5: Curriculum Progress */}
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
          <CurriculumCard
            title="Visual Card"
            text="Roblox Game Makers: Obby!"
            imageUrl="https://picsum.photos/300/200?random=3"
            progress={100}
            buttonText="Continue Lesson"
            buttonAction={() => console.log("Lesson opened")}
          />
        </div>

        {}

      </div>
    </div>
  );
};

export default LearningDashboard;