import { useEffect, useState } from "react";
import AchievementCard from "../WebsiteElements/Card/AchievementCard";

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) return;

        const res = await fetch(`http://127.0.0.1:3000/achievements?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (data.ok) {
          setAchievements(data.achievements);
        }
      } catch (err) {
        console.error("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  if (loading) return <div className="container py-4 text-center">Loading...</div>;

  return (
    <div className="container py-4">
      <h1 className="text-center my-5">Prestaties</h1>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">
            {achievements.map((ach) => (
              <AchievementCard
                key={ach._id}
                title={ach.title}
                achievementText={ach.achievementText}
                progress={ach.progress}
                achievedCount={ach.achievedCount}
                timesTriggered={ach.timesTriggered}
                firstTimeReward={ach.firstTimeReward}
                maxProgress={ach.maxProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}