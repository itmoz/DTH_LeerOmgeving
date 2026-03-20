import React from 'react';
import CurriculumCard from '../../WebsiteElements/Card/CurriculumCard.jsx';
import { useNavigate } from 'react-router-dom';

// this file is in src/pages/GMHelden1Lessons/DashboardGmHelden1.jsx

const DashboardGmHelden1 = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">GMHelden1 Lessen</h2>

      <div className="row g-4 justify-content-center">

        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
          <CurriculumCard
            title="Les 1 GMHelden1: Introductie tot Roblox Game Maken!"
            text="Een introductie tot het maken van je eigen Roblox game met als eind resultaat een Obby!"
            imageUrl="https://picsum.photos/300/200?random=3"
            progress={1}
            buttonText="Start Lesson"
            buttonAction={() => navigate("/GMHelden1/les-1")}
          />
        </div>

      </div>
    </div>
  );
};

export default DashboardGmHelden1;