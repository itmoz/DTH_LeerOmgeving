import React, { useState } from "react";
import AvatarButton from "../WebsiteElements/Buttons/AvatarButton";
import PurchaseModal from "../WebsiteElements/Modals/PurchaseModal";
import CoinExplosion from "../WebsiteElements/Effects/CoinExplosion";
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

  // --- NEW STATE FOR MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState(null); // Stores { category, item }
  const [explosions, setExplosions] = useState([]);

  // 3. Mock data for the customization options
  // You can eventually replace this with real data from your backend or assets
  const [options, setOptions] = useState({
    shape: [
      { id: "s1", name: "Round", img: ReactImage, locked: false, price: 0 },
      { id: "s2", name: "Square", img: ReactImage, locked: false, price: 0 },
      { id: "s3", name: "Triangle", img: ReactImage, locked: false, price: 0 },
      { id: "s4", name: "Hexagon", img: ReactImage, locked: true, price: 30 },
      { id: "s5", name: "Octagon", img: ReactImage, locked: true, price: 45 },
      { id: "s6", name: "Diamond", img: ReactImage, locked: true, price: 55 },
      { id: "s7", name: "Heart", img: ReactImage, locked: true, price: 70 },
    ],
    color: [
      { id: "c1", name: "Red", img: ReactImage, locked: false, price: 0 },
      { id: "c2", name: "Blue", img: ReactImage, locked: false, price: 0 },
      { id: "c3", name: "Green", img: ReactImage, locked: false, price: 0 },
      { id: "c4", name: "Yellow", img: ReactImage, locked: true, price: 20 },
      { id: "c5", name: "Purple", img: ReactImage, locked: true, price: 30 },
      { id: "c6", name: "Orange", img: ReactImage, locked: true, price: 35 },
      { id: "c7", name: "Pink", img: ReactImage, locked: true, price: 40 },
    ],
    face: [
      { id: "f1", name: "Happy", img: ReactImage, locked: false, price: 0 },
      { id: "f2", name: "Grumpy", img: ReactImage, locked: false, price: 0 },
      { id: "f3", name: "Surprised", img: ReactImage, locked: false, price: 0 },
      { id: "f4", name: "Sad", img: ReactImage, locked: true, price: 25 },
      { id: "f5", name: "Angry", img: ReactImage, locked: true, price: 35 },
      { id: "f6", name: "Neutral", img: ReactImage, locked: true, price: 45 },
      { id: "f7", name: "Winking", img: ReactImage, locked: true, price: 60 },
    ],
    accessory: [
      { id: "a1", name: "Glasses", img: ReactImage, locked: false, price: 0 },
      { id: "a2", name: "Hat", img: ReactImage, locked: false, price: 0 },
      { id: "a3", name: "Bowtie", img: ReactImage, locked: false, price: 0 },
      { id: "a4", name: "Earrings", img: ReactImage, locked: true, price: 30 },
      { id: "a5", name: "Necklace", img: ReactImage, locked: true, price: 45 },
      { id: "a6", name: "Scarf", img: ReactImage, locked: true, price: 50 },
      { id: "a7", name: "Headphones", img: ReactImage, locked: true, price: 65 },
    ],
    title: [
      { id: "t1", name: "The Brave", img: ReactImage, locked: false, price: 0 },
      { id: "t2", name: "The Wise", img: ReactImage, locked: false, price: 0 },
      { id: "t3", name: "The Swift", img: ReactImage, locked: false, price: 0 },
      { id: "t4", name: "The Cunning", img: ReactImage, locked: true, price: 35 },
      { id: "t5", name: "The Bold", img: ReactImage, locked: true, price: 45 },
      { id: "t6", name: "The Mysterious", img: ReactImage, locked: true, price: 60 },
      { id: "t7", name: "The Fearless", img: ReactImage, locked: true, price: 80 },
    ],
  });

  // Function to handle clicking an option
const handleSelect = (category, item) => {
    if (item.locked) {
      // If it's locked, stage the purchase and open the modal
      setPendingPurchase({ category, item });
      setIsModalOpen(true);
    } else {
      // If it's already unlocked, just select it normally
      setSelections((prev) => ({
        ...prev,
        [category]: item,
      }));
    }
  };

  // --- NEW HANDLERS FOR THE MODAL ---
  const handleConfirmPurchase = () => {
    if (!pendingPurchase) return;
    const { category, item } = pendingPurchase;

    // Unlock the item in the options array
    setOptions((prev) => ({
      ...prev,
      [category]: prev[category].map((optionItem) =>
        optionItem.id === item.id ? { ...optionItem, locked: false } : optionItem
      ),
    }));

    // Automatically equip (select) the newly unlocked item
    setSelections((prev) => ({
      ...prev,
      [category]: { ...item, locked: false },
    }));

    // 3. Close the modal
    handleCloseModal();

    // Handle coin explosions
    const newExplosionId = Date.now();

    setExplosions((prev) => [...prev, newExplosionId]);
    
    setTimeout(() => {
      setExplosions((prev) => prev.filter((id) => id !== newExplosionId));
    }, 1200);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPendingPurchase(null);
  };

  return (
    <div className="container py-5">
      {explosions.map((id) => (
        <CoinExplosion key={id} />
      ))}
      <h2 className="mb-4">Avatar Editor</h2>
      
      <div className="row">
        {/* === LEFT PANE: PREVIEW === */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm position-sticky" style={{ top: "1rem" }}>
            <div className="card-header bg-primary text-white text-center">
              <h5 className="mb-0">Preview</h5>
            </div>
            <div 
              className="card-body d-flex flex-column align-items-center justify-content-center" 
              style={{ minHeight: "350px" }}
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
              <div className="d-flex flex-wrap justify-content-center">
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
                        locked={item.locked}
                        price={item.price}
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
      <PurchaseModal 
        isOpen={isModalOpen}
        item={pendingPurchase?.item}
        onConfirm={handleConfirmPurchase}
        onCancel={handleCloseModal}
      />
    </div>
  );
}