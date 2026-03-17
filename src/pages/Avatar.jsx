import React, { useState } from "react";
import AvatarButton from "../WebsiteElements/Buttons/AvatarButton";
import ReactImage from "../assets/react.svg";

export default function Avatar() {
  // 1. State to keep track of the currently selected options
  const [selections, setSelections] = useState({
    shape: null,
    color: null,
    face: null,
    accessory: null,
    title: null,
  });

  // 2. State to manage which category tab is currently open
  const [activeTab, setActiveTab] = useState("shape");

  // 3. Mock data for the customization options
  // You can eventually replace this with real data from your backend or assets
  const options = {
    shape: [
      { id: "s1", name: "Round", img: ReactImage },
      { id: "s2", name: "Square", img: ReactImage },
    ],
    color: [
      { id: "c1", name: "Red", img: ReactImage },
      { id: "c2", name: "Blue", img: ReactImage },
    ],
    face: [
      { id: "f1", name: "Happy", img: ReactImage },
      { id: "f2", name: "Grumpy", img: ReactImage },
    ],
    accessory: [
      { id: "a1", name: "Glasses", img: ReactImage },
      { id: "a2", name: "Hat", img: ReactImage },
    ],
    title: [
      { id: "t1", name: "The Brave", img: ReactImage },
      { id: "t2", name: "The Wise", img: ReactImage },
    ],
  };

  // 4. Function to handle clicking an option
  const handleSelect = (category, item) => {
    setSelections((prev) => ({
      ...prev,
      [category]: item, // Overwrites the specific category with the newly selected item
    }));
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Avatar Editor</h2>
      
      <div className="row">
        {/* === LEFT PANE: PREVIEW === */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white text-center">
              <h5 className="mb-0">Preview</h5>
            </div>
            <div 
              className="card-body d-flex flex-column align-items-center justify-content-center" 
              style={{ backgroundColor: "#f8f9fa", minHeight: "350px" }}
            >
              {/* This is a text-based placeholder for your future visual preview */}
              <div className="text-muted mb-3">Visual preview goes here!</div>
              
              <ul className="list-group w-100 shadow-sm">
                <li className="list-group-item"><strong>Shape:</strong> {selections.shape?.name || "None"}</li>
                <li className="list-group-item"><strong>Color:</strong> {selections.color?.name || "None"}</li>
                <li className="list-group-item"><strong>Face:</strong> {selections.face?.name || "None"}</li>
                <li className="list-group-item"><strong>Accessory:</strong> {selections.accessory?.name || "None"}</li>
                <li className="list-group-item"><strong>Title:</strong> {selections.title?.name || "None"}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* === RIGHT PANE: CUSTOMIZATION === */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            
            {/* Tab Navigation */}
            <div className="card-header">
              <ul className="nav nav-pills card-header-pills">
                {Object.keys(options).map((category) => (
                  <li className="nav-item" key={category}>
                    <button
                      className={`nav-link text-capitalize ${activeTab === category ? "active" : ""}`}
                      onClick={() => setActiveTab(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tab Content (The Buttons) */}
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-start">
                {options[activeTab].map((item) => {
                  // Check if this specific item is currently selected to apply a highlight
                  
                  return (
                    <div 
                      key={item.id}
                    >
                      <AvatarButton
                        imageSrc={item.img}
                        onClick={() => handleSelect(activeTab, item)}
                        selected={selections[activeTab]?.id === item.id}
                      >
                        {item.name}
                      </AvatarButton>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}