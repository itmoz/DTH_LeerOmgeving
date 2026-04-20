import React from "react";

export default function ContentSection({ 
  title, 
  titleColor = "#1e88e5", 
  imageSrc,           // NEW: The URL or path to your image
  imageAlt = "Image", // NEW: Description of the image (good for accessibility)
  imageCaption,       // NEW: Optional small italic text under the image
  textBelow,          // NEW: Text to display underneath the image section
  children            // This will act as the text ABOVE the image
}) {
  return (
    <div
      className="p-4 bg-primary bg-opacity-10 mb-4"
      style={{
        borderRadius: "20px",
      }}
    >
      {/* Show the title only if one is provided */}
      {title && (
        <h2 className="text-center mt-2 mb-3" style={{ color: titleColor }}>
          {title}
        </h2>
      )}
      
      <div className="text-center">
        {/* Top Text (Your normal children) */}
        {children}
        
        {/* Optional Image Section */}
        {imageSrc && (
          <div className="my-4">
            <img 
              src={imageSrc} 
              alt={imageAlt} 
              style={{ 
                maxWidth: "100%", 
                height: "auto", 
                borderRadius: "10px" 
              }} 
            />
            {/* Optional Small Italic Caption */}
            {imageCaption && (
              <p className="mt-2 text-muted" style={{ fontStyle: "italic", fontSize: "0.85em" }}>
                {imageCaption}
              </p>
            )}
          </div>
        )}
        
        {/* Optional Text Below the Image */}
        {textBelow && (
          <div className="mt-3">
            {textBelow}
          </div>
        )}
      </div>
    </div>
  );
}