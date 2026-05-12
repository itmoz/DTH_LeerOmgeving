import React, { useState, useEffect } from "react";
import AvatarButton from "../WebsiteElements/Buttons/AvatarButton";
import Button from "../WebsiteElements/Buttons/Button";
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
  const [activeTab, setActiveTab] = useState("");

  // --- NEW STATE FOR MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState(null); // Stores { category, item }
  const [explosions, setExplosions] = useState([]); // For managing multiple coin explosions

  // options will be loaded from the backend
  const [options, setOptions] = useState({});
  const [categories, setCategories] = useState([]);

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

      // Persist equipped choice to server (non-blocking)
      (async () => {
        try {
          const email = localStorage.getItem("userEmail");
          const categoryObj = categories.find((c) => c.name === category);
          if (email && categoryObj) {
            await fetch("http://127.0.0.1:3000/equip", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, categoryId: categoryObj.id, itemId: item.id }),
            });
          }
        } catch (err) {
          console.error("Failed to persist equip:", err);
        }
      })();
    }
  };

  // --- NEW HANDLERS FOR THE MODAL ---
  const handleConfirmPurchase = async () => {
    if (!pendingPurchase) return;
    const { category, item } = pendingPurchase;

    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        alert("Not logged in");
        handleCloseModal();
        return;
      }

      const res = await fetch("http://127.0.0.1:3000/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, itemId: item.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Purchase failed");
        handleCloseModal();
        return;
      }

      // mark unlocked locally
      setOptions((prev) => ({
        ...prev,
        [category]: prev[category].map((optionItem) =>
          optionItem.id === item.id ? { ...optionItem, locked: false } : optionItem
        ),
      }));

      setSelections((prev) => ({ ...prev, [category]: { ...item, locked: false } }));

      // Persist equip on server (so equipped_items is set)
      try {
        const categoryObj = categories.find((c) => c.name === category);
        if (categoryObj) {
          await fetch("http://127.0.0.1:3000/equip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, categoryId: categoryObj.id, itemId: item.id }),
          });
        }
      } catch (err) {
        console.error("Failed to equip after purchase:", err);
      }

      window.dispatchEvent(new Event("balance-updated"));
      handleCloseModal();

      const newExplosionId = Date.now();
      setExplosions((prev) => [...prev, newExplosionId]);
      setTimeout(() => {
        setExplosions((prev) => prev.filter((id) => id !== newExplosionId));
      }, 1200);
    } catch (err) {
      console.error(err);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPendingPurchase(null);
  };

  const handleAddBalance = async (amount, opts = { showError: true }) => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        if (opts.showError) console.error("No logged-in user found");
        return { ok: false };
      }

      const parsedAmount = Number(amount);

      const res = await fetch("http://127.0.0.1:3000/add-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount: parsedAmount }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (opts.showError) console.error(data.error || "Could not update balance");
        return { ok: false };
      }

      window.dispatchEvent(new Event("balance-updated"));
      return { ok: true, balance: data.balance };
    } catch {
      if (opts.showError) console.error("Server not reachable");
      return { ok: false };
    }
  };

  const handleSaveAvatar = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        alert("You must be logged in to save your avatar.");
        return;
      }

      const res = await fetch("http://127.0.0.1:3000/save-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, selections }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save avatar");
        return;
      }

      window.dispatchEvent(new Event("avatar-saved"));
      alert("Avatar saved");
    } catch (err) {
      console.error(err);
      alert("Could not reach server to save avatar");
    }
  };

  // load categories, items and inventory from server
  useEffect(() => {
    const load = async () => {
      try {
        const email = localStorage.getItem("userEmail");

        const catRes = await fetch("http://127.0.0.1:3000/categories");
        const catData = await catRes.json();
        const cats = catData.categories || [];
        setCategories(cats);

        const opts = {};
        // fetch items per category
        for (const c of cats) {
          const itemsRes = await fetch(`http://127.0.0.1:3000/items?categoryId=${c.id}`);
          const itemsData = await itemsRes.json();
          opts[c.name] = (itemsData.items || []).map((it) => ({ ...it, locked: it.price > 0 }));
        }

        // fetch inventory to unlock items
        if (email) {
          const invRes = await fetch(`http://127.0.0.1:3000/inventory?email=${encodeURIComponent(email)}`);
          const invData = await invRes.json();
          const unlocked = new Set((invData.inventory || []).map((i) => i.item.id));

          for (const k of Object.keys(opts)) {
            opts[k] = opts[k].map((it) => (unlocked.has(it.id) ? { ...it, locked: false } : it));
          }

          // fetch equipped and set selections
          const eqRes = await fetch(`http://127.0.0.1:3000/equipped?email=${encodeURIComponent(email)}`);
          const eqData = await eqRes.json();
          const sel = {};
          (eqData.equipped || []).forEach((e) => {
            if (e.category && e.item) sel[e.category.name] = { id: e.item.id, name: e.item.name };
          });
          setSelections((prev) => ({ ...prev, ...sel }));
        }

        setOptions(opts);
      } catch (err) {
        console.error("Could not load avatar data", err);
      }
    };

    load();
  }, []);

  return (
    <div className="container py-5">
      {explosions.map((id) => (
        <CoinExplosion key={id} />
      ))}
      <h2 className="mb-4">Avatar Editor</h2>

      <div className="row">
        {/* === LEFT PANE: PREVIEW === */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white text-center">
              <h5 className="mb-0">Preview</h5>
            </div>
            <div className="card-body d-flex flex-column align-items-center justify-content-center">
              {/* This is a text-based placeholder for your future visual preview */}
              <div className="text-muted mb-3">Visual preview goes here!</div>

              <ul className="list-group w-100 shadow-sm mb-3">
                <li className="list-group-item">
                  <strong>Shape:</strong> {selections.shape?.name || "None"}
                </li>
                <li className="list-group-item">
                  <strong>Color:</strong> {selections.color?.name || "None"}
                </li>
                <li className="list-group-item">
                  <strong>Face:</strong> {selections.face?.name || "None"}
                </li>
                <li className="list-group-item">
                  <strong>Accessory:</strong>{" "}
                  {selections.accessory?.name || "None"}
                </li>
                <li className="list-group-item">
                  <strong>Title:</strong> {selections.title?.name || "None"}
                </li>
              </ul>

              <Button
                variant="primary"
                onClick={handleSaveAvatar}
              >
                Save Avatar
              </Button>
              <Button variant="warning" onClick={() => handleAddBalance(100)}>
                Add Balance + 100
              </Button>
              <Button variant="danger" onClick={() => handleAddBalance(-100)}>
                remove Balance - 100
              </Button>
            </div>
          </div>
        </div>

        {/* === RIGHT PANE: CUSTOMIZATION === */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            {/* Tab Navigation */}
            <div className="card-header">
                <ul className="nav nav-pills card-header-pills">
                  {(categories.length ? categories.map(c => c.name) : Object.keys(options)).map((category) => (
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
            <div
              className="card-body overflow-auto"
              style={{ maxHeight: "600px" }}
            >
              <div className="d-flex flex-wrap justify-content-center">
                {(options[activeTab] || []).map((item) => {
                  // Check if this specific item is currently selected to apply a highlight

                  return (
                    <div key={item.id}>
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
