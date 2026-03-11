import React from 'react';

const CustomCard = ({ 
  title, 
  text, 
  imageUrl, 
  imageAlt = "Card image", 
  buttonText, 
  buttonAction, 
  children 
}) => {
  return (
    <div className="card" style={{ width: '18rem' }}>
      {/* Conditionally render the image if a URL is provided */}
      {imageUrl && (
        <img src={imageUrl} className="card-img-top" alt={imageAlt} />
      )}
      
      <div className="card-body">
        {/* Conditionally render the title and text */}
        {title && <h5 className="card-title">{title}</h5>}
        {text && <p className="card-text">{text}</p>}
        
        {/* Render any custom content passed between the component tags */}
        {children}
        
        {/* Conditionally render the button */}
        {buttonText && (
          <button onClick={buttonAction} className="btn btn-primary">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomCard;