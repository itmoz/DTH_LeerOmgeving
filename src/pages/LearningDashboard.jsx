import React, { useEffect, useState, useRef } from "react";
import CurriculumCard from "../WebsiteElements/Card/CurriculumCard.jsx";
import { useNavigate } from "react-router-dom";

import DataMiniGameBanner from "../Images/DataMinigameBanner.png";
import GmHelden1CurriculumCard from "../Images/CurriculumcardGMhelden1.png";

const API_BASE =
  "https://f2nrinvnh9.execute-api.us-east-1.amazonaws.com/Prod";

const LearningDashboard = () => {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [user, setUser] = useState(null);

  const continueLessonButtonText = "Continue Lesson";

  const hasFetchedUser = useRef(false);
  const hasFetchedLessons = useRef(false);

  useEffect(() => {
    if (hasFetchedLessons.current) return;
    hasFetchedLessons.current = true;

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

  useEffect(() => {
    if (hasFetchedUser.current) return;
    hasFetchedUser.current = true;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/user`, {
          credentials: "include",
        });

        const data = await res.json();

        if (data?.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const getProgress = (lessonId) => {
    if (!user?.progression || !lessonId) return 0;

    const lesson = user.progression.find(
      (p) => String(p.lesson_id) === String(lessonId)
    );

    return lesson?.completed ? 100 : 0;
  };

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
            progress={getProgress(lesson1?.lesson_id)}
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
            progress={getProgress(lesson2?.lesson_id)}
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