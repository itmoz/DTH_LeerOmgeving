import React from "react";
import CustomCard from "./CustomCard";

const CurriculumCard = ({
  title,
  text,
  imageUrl,
  progress = 0,
  buttonText,
  buttonAction,
}) => {
  const getProgressColor = () => {
    if (progress === 0) {
      return "gray";
    }

    // Convert progress (1-100) to hue (0-120)
    const hue = (progress / 100) * 120;

    return `hsl(${hue}, 70%, 45%)`;
  };

  const progressColor = getProgressColor();

  // Centralized button label logic
  const resolvedButtonText =
    progress === 0 ? "Begin" : (buttonText ?? "Continue Lesson");

  return (
    <CustomCard
      title={title}
      text={text}
      imageUrl={imageUrl}
      buttonText={resolvedButtonText}
      buttonAction={buttonAction}
    >
      {/* Progress Section */}
      <div className="mt-4 pt-3 border-top">
        <div className="d-flex justify-content-between mb-2">
          <span>{progress}% compleet!</span>
        </div>

        <div className="progress mb-3">
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${progress}%`,
              backgroundColor: progressColor,
            }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>
        </div>
      </div>
    </CustomCard>
  );
};

export default CurriculumCard;
