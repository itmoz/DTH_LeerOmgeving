import AchievementCard from "../WebsiteElements/Card/AchievementCard";

export default function Achievements() {
  return (
    <div className="container py-4">
      <h1 className="text-center my-5">Prestaties</h1>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <AchievementCard
            title="Eerste stappen"
            achievementText="Voltooi je eerste les."
            progress={50}
            achievedCount={1}
            firstTimeReward={50}
          />
        </div>
      </div>
    </div>
  );
}
