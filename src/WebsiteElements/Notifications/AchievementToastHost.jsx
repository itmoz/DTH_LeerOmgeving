import { useEffect, useState } from "react";
import CoinExplosion from "../Effects/CoinExplosion";

export default function AchievementToastHost() {
  const [toastData, setToastData] = useState(null);
  const [showCoinExplosion, setShowCoinExplosion] = useState(false);

  useEffect(() => {
    const handleUnlocked = (event) => {
      const achievements = event.detail?.achievements || [];
      if (achievements.length === 0) return;

      const totalCoins = achievements.reduce(
        (sum, achievement) => sum + (Number(achievement.reward) || 0),
        0,
      );
      setToastData({
        name: achievements[0].name,
        reward: totalCoins,
        count: achievements.length,
      });
      setShowCoinExplosion(true);

      window.setTimeout(() => {
        setShowCoinExplosion(false);
      }, 1400);
    };

    window.addEventListener("achievement-unlocked", handleUnlocked);
    return () =>
      window.removeEventListener("achievement-unlocked", handleUnlocked);
  }, []);

  useEffect(() => {
    if (!toastData) return undefined;

    const hideTimer = window.setTimeout(() => {
      setToastData(null);
    }, 4000);

    return () => window.clearTimeout(hideTimer);
  }, [toastData]);

  if (!toastData && !showCoinExplosion) return null;

  return (
    <>
      {showCoinExplosion && <CoinExplosion />}

      {toastData && (
        <div
          aria-live="polite"
          aria-atomic="true"
          className="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3"
          style={{ zIndex: 1080, marginBottom: "1.25rem" }}
        >
          <div
            className="toast show align-items-center border-0 shadow-lg"
            role="status"
            style={{ minWidth: "320px" }}
          >
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-3 py-3 px-4">
                <div
                  className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "42px", height: "42px" }}
                >
                  <i className="bi bi-trophy-fill fs-5"></i>
                </div>

                <div className="text-start">
                  <div className="fw-semibold">Achievement voltooid</div>
                  <div className="small text-body-secondary">
                    {toastData.name}
                  </div>
                  <div className="small text-warning-emphasis fw-semibold">
                    <i className="dth-coin me-1"></i>+{toastData.reward} munten
                    verdiend
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-close me-3 m-auto"
                aria-label="Close"
                onClick={() => setToastData(null)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
