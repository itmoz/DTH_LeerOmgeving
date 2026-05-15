import React from "react";

export default function ContentSection({ 
  title, 
  titleColor = "#1e88e5", 
  contentBlocks = [], // NEW: An array of content objects
  children,
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
        {/* Render content passed as children */}
        {children}

        {/* Loop through the array of content blocks */}
        {contentBlocks.map((block, index) => (
          <div key={index} className="mb-5">
            
            {/* 1. Text Above the Image */}
            {block.textAbove && (
              <div>{block.textAbove}</div>
            )}
            
            {/* 2. Optional Image Section */}
            {block.imageSrc && (
              <div className="my-4">
                <img 
                  src={block.imageSrc} 
                  alt={block.imageAlt || "Image"} 
                  style={{ 
                    maxWidth: "100%", 
                    height: "auto", 
                    borderRadius: "10px" 
                  }} 
                />
                {/* Optional Small Italic Caption */}
                {block.imageCaption && (
                  <p className="mt-2 text-muted" style={{ fontStyle: "italic", fontSize: "0.85em" }}>
                    {block.imageCaption}
                  </p>
                )}
              </div>
            )}
            
            {/* 3. Text Below the Image */}
            {block.textBelow && (
              <div className="mt-3">
                {block.textBelow}
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}