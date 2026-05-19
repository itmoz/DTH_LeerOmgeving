export async function triggerAchievement(eventName, eventData = {}) {
  try {
    const email = localStorage.getItem("userEmail");
    if (!email) return { ok: false };

    const res = await fetch("http://127.0.0.1:3000/achievement/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, eventName, eventData, timestamp: new Date().toISOString() }),
    });

    const data = await res.json();
    if (!res.ok) return { ok: false };

    if (data.unlockedAchievements?.length > 0) {
      window.dispatchEvent(new CustomEvent("achievement-unlocked", { detail: { achievements: data.unlockedAchievements } }));
      window.dispatchEvent(new Event("balance-updated"));
    }

    return { ok: true, data };
  } catch (err) {
    console.error("Achievement error:", err);
    return { ok: false };
  }
}