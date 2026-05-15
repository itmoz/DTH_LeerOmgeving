import React, { useState, useEffect } from "react";
import AvatarButton from "../WebsiteElements/Buttons/AvatarButton";
import Button from "../WebsiteElements/Buttons/Button";
import PurchaseModal from "../WebsiteElements/Modals/PurchaseModal";
import CoinExplosion from "../WebsiteElements/Effects/CoinExplosion";

const avatarImageUrls = import.meta.glob("../Images/Avatar/*.svg", {
  eager: true,
  import: "default",
});

const avatarSvgRawMap = import.meta.glob("../Images/Avatar/*.svg", {
  eager: true,
  import: "default",
  query: "?raw",
});

const avatarCategories = ["shape", "color", "face", "accessory", "title"];
const avatarPreviewLayerOrder = [
  { category: "shape", shade: 0 },
  { category: "face", shade: 0.25 },
  { category: "accessory", shade: 0.4 },
];

const createTintedSvgDataUri = (svgMarkup, colorHex) => {
  const tintedSvg = svgMarkup.replace(/currentColor/g, colorHex);
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(tintedSvg)}`;
};

const normalizeHexColor = (colorHex) => {
  const fallback = "#7C99C9";
  if (!colorHex || typeof colorHex !== "string") return fallback;

  const hex = colorHex.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return `#${hex
      .slice(1)
      .split("")
      .map((char) => char + char)
      .join("")}`;
  }

  return fallback;
};

const shadeHexColor = (colorHex, shadeAmount) => {
  const normalizedHex = normalizeHexColor(colorHex).slice(1);
  const numeric = Number.parseInt(normalizedHex, 16);
  if (Number.isNaN(numeric)) return normalizeHexColor(colorHex);

  const red = Math.max(0, Math.min(255, Math.round(((numeric >> 16) & 255) * (1 - shadeAmount))));
  const green = Math.max(0, Math.min(255, Math.round(((numeric >> 8) & 255) * (1 - shadeAmount))));
  const blue = Math.max(0, Math.min(255, Math.round((numeric & 255) * (1 - shadeAmount))));

  return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
};

const getAvatarSvgMarkup = (itemName) => avatarSvgRawMap[`../Images/Avatar/${itemName}.svg`] || "";

const getAvatarItemImageSrc = (category, item, tintColor) => {
  if (!item) return "";

  if (category === "color") {
    const colorMarkup = getAvatarSvgMarkup("Color");
    return colorMarkup ? createTintedSvgDataUri(colorMarkup, normalizeHexColor(item.color_hex)) : "";
  }

  if (category === "title") {
    const titleMarkup = getAvatarSvgMarkup("Title");
    return titleMarkup ? createTintedSvgDataUri(titleMarkup, normalizeHexColor(tintColor)) : "";
  }

  const svgMarkup = getAvatarSvgMarkup(item.name);
  if (!svgMarkup) {
    return avatarImageUrls[`../Images/Avatar/${item.name}.svg`] || "";
  }

  const tint = normalizeHexColor(tintColor);
  return createTintedSvgDataUri(svgMarkup, tint);
};

const getCategoryLabel = (category) => category.charAt(0).toUpperCase() + category.slice(1);

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

  const avatarBaseColor = normalizeHexColor(
    selections.color?.color_hex || options.color?.find((item) => item.id === selections.color?.id)?.color_hex
  );
  const previewLayers = avatarPreviewLayerOrder
    .map(({ category, shade }) => ({ category, item: selections[category], shade }))
    .filter(({ item }) => Boolean(item))
    .map(({ category, item, shade }) => ({
      category,
      item,
      imageSrc: createTintedSvgDataUri(getAvatarSvgMarkup(item.name), shadeHexColor(avatarBaseColor, shade)),
    }));

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

        if (!activeTab && cats.length > 0) {
          setActiveTab(cats[0].name);
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
            if (!e.category || !e.item) return;

            const categoryItems = opts[e.category.name] || [];
            const matchedItem = categoryItems.find((optionItem) => optionItem.id === e.item.id);
            sel[e.category.name] = matchedItem || {
              id: e.item.id,
              name: e.item.name,
              price: e.item.price || 0,
              color_hex: e.item.color_hex || null,
            };
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
            <div className="card-body d-flex flex-column align-items-center justify-content-center gap-3">
              <div
                className="w-100 rounded-4 border position-relative overflow-hidden"
                style={{
                  aspectRatio: "1 / 1.15",
                  maxWidth: "340px",
                  backgroundColor: "var(--bs-body-bg)",
                }}
              >
                {previewLayers.length > 0 ? (
                  previewLayers.map(({ category, item, imageSrc }, index) => (
                    <img
                      key={`${category}-${item.id}`}
                      src={imageSrc}
                      alt={`${item.name} layer`}
                      className="position-absolute top-50 start-50"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        transform: "translate(-50%, -50%)",
                        zIndex: index + 1,
                        pointerEvents: "none",
                      }}
                    />
                  ))
                ) : (
                  <div className="h-100 d-flex align-items-center justify-content-center text-center text-muted px-4">
                    Select avatar items to build the character preview.
                  </div>
                )}
              </div>

              <div className="w-100 text-center">
                <div className="text-uppercase small text-muted">Title</div>
                <div
                  className="fw-semibold fs-5"
                  style={{ color: shadeHexColor(avatarBaseColor, 0.45) }}
                >
                  {selections.title?.name || "No title selected"}
                </div>
              </div>

              {/* <div className="d-flex flex-wrap justify-content-center gap-2 w-100">
                {avatarCategories.map((category) => {
                  const selectedItem = selections[category];

                  return (
                    <div
                      key={category}
                      className="d-inline-flex align-items-center gap-2 rounded-pill border bg-white px-3 py-2 shadow-sm"
                    >
                      <span className="text-uppercase small text-muted">{getCategoryLabel(category)}</span>
                      <span className="fw-semibold">{selectedItem?.name || "None"}</span>
                    </div>
                  );
                })}
              </div> */}
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
                {(categories.length ? categories.map((c) => c.name) : Object.keys(options)).map((category) => (
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
                  return (
                    <div key={item.id}>
                      <AvatarButton
                        imageSrc={getAvatarItemImageSrc(activeTab, item, avatarBaseColor)}
                        imageAlt={`${item.name} avatar item`}
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
        imageSrc={pendingPurchase ? getAvatarItemImageSrc(pendingPurchase.category, pendingPurchase.item) : ""}
        onConfirm={handleConfirmPurchase}
        onCancel={handleCloseModal}
      />
    </div>
  );
}
