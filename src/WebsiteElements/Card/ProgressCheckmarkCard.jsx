import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
// Zorg ervoor dat dit pad klopt!
import CoinExplosion from "../Effects/CoinExplosion";

// De functie om het saldo bij te werken
const handleAddBalance = async (amount, opts = { showError: true }) => {
  try {
    const parsedAmount = Number(amount);

    const res = await fetch("http://localhost:3000/add-balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount: parsedAmount }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (opts.showError) console.error(data.error || "Could not update balance");
      return { ok: false };
    }

    window.dispatchEvent(new Event("balance-updated"));
    return { ok: true, balance: data.balance };
  } catch {
    if (opts.showError) console.error("Server not reachable");
    return { ok: false };
  }
};

const ProgressCheckmarkCard = ({
  cardId = "default-card", // NIEUW: Unieke ID voor localStorage
  title,
  items = [],
  width = "100%",
  maxWidth = "600px",
  itemPadding = "1rem 0",
  iconPosition = "start",
  iconSize = "1.5rem",
  headingColor = "primary",
  bgColor = "#e3f2fd",
  borderRadius = "20px",
  textColor = "text-dark",
  textCompletedColor = "text-success",
  onItemChange,
  PlaysConfetti = true,
  itemReward = 0,       
  completionReward = 0, 
}) => {
  
  // 1. Initialiseer state vanuit localStorage
  const [checkedIds, setCheckedIds] = useState(() => {
    const saved = localStorage.getItem(`${cardId}-checked`);
    if (saved) {
      return JSON.parse(saved);
    }
    return items.filter((item) => item.checked).map((item) => item.id);
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCoinExplosion, setShowCoinExplosion] = useState(false); 
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  // 2. Sla de checkedIds op in localStorage telkens als ze veranderen
  useEffect(() => {
    localStorage.setItem(`${cardId}-checked`, JSON.stringify(checkedIds));
  }, [checkedIds, cardId]);

  // Checken of alles al is gedaan
  const allDone = items.length > 0 && items.every((item) => checkedIds.includes(item.id));

  const toggleItem = (id) => {
    // Als alles al is voltooid, mag de speler niets meer uitvinken. We doen dan niets.
    if (allDone) return;

    let newCheckedIds;
    const isCurrentlyChecked = checkedIds.includes(id);

    if (isCurrentlyChecked) {
      newCheckedIds = checkedIds.filter((checkedId) => checkedId !== id);
    } else {
      newCheckedIds = [...checkedIds, id];
      
      // Als er een beloning staat op losse vakjes en het vakje wordt zojuist aangevinkt
      if (itemReward > 0) {
        handleAddBalance(itemReward);
      }
    }
    
    setCheckedIds(newCheckedIds);

    // 3. Controleer of DIT specifieke moment de lijst compleet maakt
    const isNowAllDone = items.length > 0 && items.every((item) => newCheckedIds.includes(item.id));

    if (isNowAllDone) {
      // Het is NU net voltooid! Start de animaties en geef de eindbeloning
      if (PlaysConfetti) {
        setShowConfetti(true);
      }

      if (completionReward > 0) {
        handleAddBalance(completionReward);
        setShowCoinExplosion(true);
      }

      // Zet de animaties na 5 seconden weer uit
      setTimeout(() => {
        setShowConfetti(false);
        setShowCoinExplosion(false);
      }, 5000);
    }

    if (onItemChange) {
      const updatedItems = items.map((item) => ({
        ...item,
        checked: newCheckedIds.includes(item.id),
      }));
      onItemChange(updatedItems);
    }
  };

  return (
    <>
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, pointerEvents: 'none' }}>
           <Confetti
             width={windowWidth}
             height={windowHeight}
             recycle={false}
             numberOfPieces={400}
           />
        </div>
      )}

      {/* Runt de munten explosie over het scherm als de eindbeloning is behaald */}
      {showCoinExplosion && <CoinExplosion />}

      <div
        className="card shadow-sm mx-auto"
        style={{
          width: width,
          maxWidth: maxWidth,
          backgroundColor: bgColor,
          borderRadius: borderRadius,
          border: "none",
          position: "relative",
        }}
      >
        <div className="card-body p-4 text-center">
          {title && (
            <h3
              className="card-title text-center fw-bold mb-4"
              style={{ color: headingColor }}
            >
              {title}
            </h3>
          )}

          <ul className="list-group list-group-flush bg-transparent mb-3">
            {items.map((item) => {
              const isChecked = checkedIds.includes(item.id);
              
              return (
                <li
                  key={item.id}
                  className="list-group-item d-flex align-items-center bg-transparent border-bottom"
                  style={{
                    padding: itemPadding,
                    // Als het helemaal klaar is, verander de cursor zodat het duidelijk is dat je niet meer kan klikken
                    cursor: allDone ? "default" : "pointer",
                    justifyContent: iconPosition === "end" ? "space-between" : "flex-start",
                    borderBottomColor: "rgba(0,0,0,0.05)",
                  }}
                  onClick={() => toggleItem(item.id)}
                >
                  {iconPosition === "start" && (
                    <i
                      className={`bi ${isChecked ? "bi-check-square-fill text-success" : "bi-square text-secondary"} me-3`}
                      style={{ fontSize: iconSize }}
                    ></i>
                  )}

                  <span
                    className={isChecked ? textCompletedColor : textColor}
                    style={{
                      flex: 1, 
                      textAlign: "left",
                      wordBreak: "break-word",
                      padding: "0 10px", 
                      fontSize: "1.1rem",
                      textDecoration: isChecked ? "line-through" : "none",
                      transition: "color 0.2s, text-decoration 0.2s",
                    }}
                  >
                    {item.text}
                  </span>

                  {iconPosition === "end" && (
                    <i
                      className={`bi ${isChecked ? "bi-check-square-fill text-success" : "bi-square text-secondary"} ms-3`}
                      style={{ fontSize: iconSize }}
                    ></i>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Visuele feedback onderaan de kaart als de speler alles heeft gehaald en er een beloning was */}
          {allDone && completionReward > 0 && (
            <div className="mt-3 p-2 bg-white rounded shadow-sm d-inline-block">
              <h5 className="text-warning m-0" style={{ fontWeight: "bold" }}>
                <i className="dth-coin me-2"></i>
                +{completionReward} Munten verdiend!
              </h5>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProgressCheckmarkCard;