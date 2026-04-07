import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const ProgressCheckmarkCard = ({
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
}) => {
  const [checkedIds, setCheckedIds] = useState(() => {
    return items.filter((item) => item.checked).map((item) => item.id);
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  
  // NIEUW: Een geheugensteuntje om bij te houden of de confetti al is geweest
  const hasCelebrated = useRef(false);

  useEffect(() => {
    const allDone = items.length > 0 && items.every((item) => checkedIds.includes(item.id));

    // Controleer nu ook of we het nog NIET gevierd hebben (!hasCelebrated.current)
    if (allDone && PlaysConfetti && !hasCelebrated.current) {
      setShowConfetti(true);
      hasCelebrated.current = true; // Onthoud dat het feestje is geweest!
      
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    } else if (!allDone) {
      // Als niet alles is afgevinkt, resetten we de confetti en het geheugensteuntje
      setShowConfetti(false);
      hasCelebrated.current = false; 
    }
  }, [checkedIds, items, PlaysConfetti]);

  const toggleItem = (id) => {
    let newCheckedIds;
    if (checkedIds.includes(id)) {
      newCheckedIds = checkedIds.filter((checkedId) => checkedId !== id);
    } else {
      newCheckedIds = [...checkedIds, id];
    }
    
    setCheckedIds(newCheckedIds);

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
        <div className="card-body p-4">
          {title && (
            <h3
              className="card-title text-center fw-bold mb-4"
              style={{ color: headingColor }}
            >
              {title}
            </h3>
          )}

          <ul className="list-group list-group-flush bg-transparent">
            {items.map((item) => {
              const isChecked = checkedIds.includes(item.id);
              
              return (
                <li
                  key={item.id}
                  className="list-group-item d-flex align-items-center bg-transparent border-bottom"
                  style={{
                    padding: itemPadding,
                    cursor: "pointer",
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
        </div>
      </div>
    </>
  );
};

export default ProgressCheckmarkCard;