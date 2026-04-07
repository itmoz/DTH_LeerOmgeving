import React, { useState, useEffect } from "react";
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
  // FIX 1: Store only the IDs of the checked items. 
  // This ensures new items added to the array prop show up instantly!
  const [checkedIds, setCheckedIds] = useState(() => {
    return items.filter((item) => item.checked).map((item) => item.id);
  });
  
  const [showConfetti, setShowConfetti] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useEffect(() => {
    // Check if every item in the passed prop array is in our checkedIds state
    const allDone = items.length > 0 && items.every((item) => checkedIds.includes(item.id));

    if (allDone && PlaysConfetti) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [checkedIds, items, PlaysConfetti]);

  const toggleItem = (id) => {
    let newCheckedIds;
    if (checkedIds.includes(id)) {
      // Remove ID if already checked
      newCheckedIds = checkedIds.filter((checkedId) => checkedId !== id);
    } else {
      // Add ID if not checked
      newCheckedIds = [...checkedIds, id];
    }
    
    setCheckedIds(newCheckedIds);

    // Pass the updated array structure back to the parent if needed
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
            {/* FIX 2: Map over 'items' directly instead of a state copy */}
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

                  {/* FIX 3: Added flex: 1 and wordBreak so long text wraps properly inside the layout */}
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