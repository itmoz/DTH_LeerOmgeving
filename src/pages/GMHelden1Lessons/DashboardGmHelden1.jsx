import React from "react";
import LessonCard from "../../WebsiteElements/Card/LessonCard.jsx"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";

import Les1Banner from "../../Images/BannerImages/GMHelden1/Les1BannerImage.png"; // Importeer hier je banner afbeelding voor les 1
import Les2Banner from "../../Images/BannerImages/GMHelden1/DTH1_Les_2_BannerImage.png";

const DashboardGmHelden1 = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Beginner Roblox Game Maken!</h2>
      <p className="text-center mb-4">
        In deze lessenreeks leer je stap voor stap hoe je je eigen Roblox game maakt, met als eindresultaat een coole Obby! Klik op de lessen hieronder om te beginnen.
      </p>

      {/* Vertical Grid Wrapper */}
      <div className="row justify-content-center">
        {/* Constraining max width slightly for readability (col-lg-8), and stacking children vertically with a gap */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          <LessonCard
            title="Les 1 GMHelden1: Introductie tot Roblox Game Maken!"
            text="Een introductie tot Roblox en wat we gaan maken aan het einde van deze lessenreeks!"
            imageUrl={Les1Banner}
            completed={true}
            buttonAction={() => navigate("/GMHelden1/les-1")}
          />

          <LessonCard
            title="Les 2 GMHelden1: Obby Mechanics!"
            text="Leer de basis van werken binnen Roblox Studio en het plaatsen van platforms!"
            imageUrl={Les2Banner}
            completed={false}
            buttonAction={() => navigate("/GMHelden1/les-2")}
          />

          <LessonCard
            title="Les 3 GMHelden1: Obby Design!"
            text="Leer hoe je je obby er leuker uit kan laten zien en je eerste obstacles kan maken!"
            imageUrl="https://picsum.photos/800/300?random=5"
            completed={false}
            buttonAction={() => navigate("/GMHelden1/les-3")}
          />
          <LessonCard
            title="Les 4 GMHelden1: Obby Uitbreiden!"
            text="Leer hoe je je Obby uitdagender maakt met bewegende platforms en vijanden."
            imageUrl="https://picsum.photos/800/300?random=6"
            completed={false}
            buttonAction={() => navigate("/GMHelden1/les-4")}
          />
          <LessonCard
            title="Les 5 GMHelden1: Obby Publiceren!"
            text="Leer hoe je je Obby publiceert en deelt met vrienden."
            imageUrl="https://picsum.photos/800/300?random=7"
            completed={false}
            buttonAction={() => navigate("/GMHelden1/les-5")}
          />
          <LessonCard
            title="Les 6 GMHelden1: Obby Verbeteren!"
            text="Leer hoe je feedback krijgt en je Obby verbetert."
            imageUrl="https://picsum.photos/800/300?random=8"
            completed={false}
            buttonAction={() => navigate("/GMHelden1/les-6")}
          />
          <LessonCard
            title="Les 7 GMHelden1: Obby Uitbreiden!"
            text="Leer hoe je je Obby nog uitdagender maakt met bewegende platforms en vijanden."
            imageUrl="https://picsum.photos/800/300?random=9"
            completed={false}
            buttonAction={() => navigate("/GMHelden1/les-7")}
          />
          <LessonCard
            title="Les 8 GMHelden1: Obby Publiceren!"
            text="Leer hoe je je Obby publiceert en deelt met vrienden."
            imageUrl="https://picsum.photos/800/300?random=10"
            completed={false}
            buttonAction={() => navigate("/GMHelden1/les-8")}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardGmHelden1;
