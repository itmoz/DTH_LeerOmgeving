import React from "react";
import CustomCard from "./CustomCard";

const LessonCard = ({
  title,
  text,
  imageUrl,
  completed = false,
  buttonText,
  buttonAction,
}) => {
  // Default text logic if none is provided
  const resolvedButtonText =
    buttonText ?? (completed ? "Opnieuw Bekijken" : "Start Les");

  return (
    <CustomCard
      title={title}
      text={text}
      imageUrl={imageUrl}
      buttonText={resolvedButtonText}
      buttonAction={buttonAction}
      width="100%" // Forces the card to be wide
    >
      {/* Added mb-4 here to increase space between this block and the button below it */}
      <div className="mt-2 mb-4 pt-3 border-top">
        {completed ? (
          <span className="badge bg-success">Voltooid</span>
        ) : (
          <span className="badge bg-secondary">Nog niet voltooid</span>
        )}
      </div>
    </CustomCard>
  );
};

export default LessonCard;
