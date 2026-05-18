export default function AchievementCard({
  title,
  achievementText,
  progress = 0,
  achievedCount = 0,
  firstTimeReward = 0,
  maxProgress = 100,
}) {
  const normalizedProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  const achievedTierColor =
    achievedCount >= 50 ? "#d4af37" : achievedCount >= 20 ? "#c0c0c0" : achievedCount >= 1 ? "#cd7f32" : "#6c757d";
  const achievementIconClass = achievedCount === 0 ? "bi bi-dash-circle-dotted" : "bi bi-award-fill";

  return (
    <div className="card shadow-sm w-100">
      <div className="card-body p-4">
        <div className="d-flex align-items-start gap-3 mb-3">
          <i
            className={`${achievementIconClass} flex-shrink-0`}
            style={{ fontSize: "3rem", color: achievedTierColor, lineHeight: 1 }}
          ></i>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h5 className="card-title mb-1">{title}</h5>
                <p className="text-body-secondary mb-0">{achievementText}</p>
              </div>

              {achievedCount === 0 ? (
                <span className="badge text-bg-primary rounded-pill px-3 py-2">
                  <i className="dth-coin me-1"></i>
                  +{firstTimeReward} Eerste keer
                </span>
              ) : (
                <span className="badge text-bg-success rounded-pill px-3 py-2">
                  Voltooid!
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-2 d-flex justify-content-between small text-body-secondary">
          <span>{normalizedProgress}% voltooid</span>
          <span>{achievedCount} keer behaald</span>
        </div>

        <div className="progress mb-3" style={{ height: "12px" }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${normalizedProgress}%` }}
            aria-valuenow={normalizedProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>
    </div>
  );
}