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
  headingColor = "#1e88e5",
  bgColor = "#e3f2fd",
  borderRadius = "20px",
  onItemChange,
}) => {
  const [listItems, setListItems] = useState(items);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  // Effect to check if all items are completed
  useEffect(() => {
    // Check if the list isn't empty AND every item is checked
    const allDone = listItems.length > 0 && listItems.every((item) => item.checked);
    
    if (allDone) {
      setShowConfetti(true);
      // Turn off confetti after 5 seconds so it doesn't get annoying
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [listItems]);

  const toggleItem = (id) => {
    const updatedItems = listItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setListItems(updatedItems);

    if (onItemChange) {
      onItemChange(updatedItems);
    }
  };

  return (
    <>
      {/* Confetti overlay - will only render when showConfetti is true */}
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, pointerEvents: 'none' }}>
           <Confetti
              width={windowWidth}
              height={windowHeight}
              recycle={false} // Setting to false makes it shoot once and stop, rather than falling continuously
              numberOfPieces={400} // A good burst amount!
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
          position: "relative", // Ensures the card stays in normal document flow
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
            {listItems.map((item) => (
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
                    className={`bi ${
                      item.checked ? "bi-check-square-fill text-success" : "bi-square text-secondary"
                    } me-3`}
                    style={{ fontSize: iconSize }}
                  ></i>
                )}

                <span
                  style={{
                    fontSize: "1.1rem",
                    textDecoration: item.checked ? "line-through" : "none",
                    color: item.checked ? "#6c757d" : "inherit",
                    transition: "color 0.2s, text-decoration 0.2s",
                  }}
                >
                  {item.text}
                </span>

                {iconPosition === "end" && (
                  <i
                    className={`bi ${
                      item.checked ? "bi-check-square-fill text-success" : "bi-square text-secondary"
                    } ms-3`}
                    style={{ fontSize: iconSize }}
                  ></i>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProgressCheckmarkCard;