import React, { useEffect, useState } from 'react';
import CustomCard from '../WebsiteElements/Card/CustomCard.jsx';
import CurriculumCard from '../WebsiteElements/Card/CurriculumCard.jsx';
import { useNavigate } from 'react-router-dom';

import DataMiniGameBanner from '../Images/DataMinigameBanner.png';
import GmHelden1CurriculumCard from '../Images/CurriculumcardGMhelden1.png';

const API_BASE =
  "https://cisf9p7hpa.execute-api.us-east-1.amazonaws.com/Prod";

const LearningDashboard = () => {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const continueLessonButtonText = "Continue Lesson";

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`${API_BASE}/lessons`);
        const data = await res.json();
        setLessons(data);
      } catch (err) {
        console.error("Error fetching lessons:", err);
      }
    };

    fetchLessons();
  }, []);

  const lesson1 = lessons[0];
  const lesson2 = lessons[1];

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Curriculums</h2>

      <div className="row g-4 justify-content-center">

        {/* Lesson 1 */}
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
          <CurriculumCard
            title={lesson1?.title || "Loading..."}
            text={lesson1?.text || "Loading lesson..."}
            imageUrl={GmHelden1CurriculumCard}
            progress={0}
            buttonText={continueLessonButtonText}
            buttonAction={() =>
              lesson1 && navigate(`/lessons/${lesson1.lesson_id}`)
            }
          />
        </div>

        {/* Lesson 2 */}
        <div className="col-12 col-md-6 col-lg-4 d-flex justify-content-center">
          <CurriculumCard
            title={lesson2?.title || "Loading..."}
            text={lesson2?.text || "Loading lesson..."}
            imageUrl={DataMiniGameBanner}
            buttonText={"Speel nu!"}
            buttonAction={() =>
              lesson2 && navigate(`/lessons/${lesson2.lesson_id}`)
            }
          />
        </div>

      </div>
    </div>
  );
};
export default LearningDashboard;