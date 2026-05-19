import React from "react";
import LessonCard from "../../WebsiteElements/Card/LessonCard.jsx"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";

const DashboardGmHelden2 = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">GMHelden1 Lessen</h2>

      {/* Vertical Grid Wrapper */}
      <div className="row justify-content-center">
        {/* Constraining max width slightly for readability (col-lg-8), and stacking children vertically with a gap */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          <LessonCard
            title="Les 1 GMHelden1: Introductie tot Roblox Game Maken!"
            text="Een introductie tot het maken van je eigen Roblox game met als eind resultaat een Obby!"
            completed={true}
            buttonAction={() => navigate("/GMHelden2/les-1")}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardGmHelden2;
