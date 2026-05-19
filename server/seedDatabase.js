import { connectDB } from "./database.js";

async function seed() {
  try {
    const db = await connectDB();

    // Seed avatar customization
    const categories = [
      { name: "shape" },
      { name: "color" },
      { name: "face" },
      { name: "accessory" },
      { name: "title" },
    ];

    // Upsert categories
    const catResults = {};
    for (const cat of categories) {
      const res = await db.collection("categories").findOneAndUpdate(
        { name: cat.name },
        { $setOnInsert: cat },
        { upsert: true, returnDocument: "after" }
      );
      // In some driver versions `res.value` may be undefined after upsert, so fall back to findOne
      if (res && res.value && res.value._id) {
        catResults[cat.name] = res.value._id;
      } else {
        const doc = await db.collection("categories").findOne({ name: cat.name });
        if (!doc) throw new Error(`Failed to upsert or find category ${cat.name}`);
        catResults[cat.name] = doc._id;
      }
    }

    // Items mapped like the frontend mock data
    const items = [
      // shapes
      { name: "Round", price: 0, category: "shape" },
      { name: "Square", price: 0, category: "shape" },
      { name: "Triangle", price: 0, category: "shape" },
      { name: "Hexagon", price: 30, category: "shape" },
      { name: "Octagon", price: 45, category: "shape" },
      { name: "Diamond", price: 55, category: "shape" },
      { name: "Heart", price: 70, category: "shape" },

      // colors
      { name: "Red", price: 0, category: "color" },
      { name: "Blue", price: 0, category: "color" },
      { name: "Green", price: 0, category: "color" },
      { name: "Yellow", price: 20, category: "color" },
      { name: "Purple", price: 30, category: "color" },
      { name: "Orange", price: 35, category: "color" },
      { name: "Pink", price: 40, category: "color" },

      // faces
      { name: "Happy", price: 0, category: "face" },
      { name: "Grumpy", price: 0, category: "face" },
      { name: "Surprised", price: 0, category: "face" },
      { name: "Sad", price: 25, category: "face" },
      { name: "Angry", price: 35, category: "face" },
      { name: "Neutral", price: 45, category: "face" },
      { name: "Winking", price: 60, category: "face" },

      // accessories
      { name: "Glasses", price: 0, category: "accessory" },
      { name: "Hat", price: 0, category: "accessory" },
      { name: "Bowtie", price: 0, category: "accessory" },
      { name: "Earrings", price: 30, category: "accessory" },
      { name: "Necklace", price: 45, category: "accessory" },
      { name: "Scarf", price: 50, category: "accessory" },
      { name: "Headphones", price: 65, category: "accessory" },

      // titles
      { name: "The Brave", price: 0, category: "title" },
      { name: "The Wise", price: 0, category: "title" },
      { name: "The Swift", price: 0, category: "title" },
      { name: "The Cunning", price: 35, category: "title" },
      { name: "The Bold", price: 45, category: "title" },
      { name: "The Mysterious", price: 60, category: "title" },
      { name: "The Fearless", price: 80, category: "title" },
    ];

    const colorHexMap = {
      Red: "#FF3B30",
      Blue: "#007AFF",
      Green: "#34C759",
      Yellow: "#FFCC00",
      Purple: "#5856D6",
      Orange: "#FF9500",
      Pink: "#FF2D55",
    };

    for (const it of items) {
      const doc = {
        name: it.name,
        price: it.price,
        color_hex: it.category === "color" ? (colorHexMap[it.name] || null) : null,
        category_id: catResults[it.category],
        createdAt: new Date(),
      };

      // upsert by name + category to avoid duplicates
      await db.collection("items").updateOne(
        { name: it.name, category_id: catResults[it.category] },
        { $setOnInsert: doc },
        { upsert: true }
      );
    }

    // Seed achievements
    const achievements = [
    {
      name: "Eerste stappen",
      description: "Voltooi je eerste les.",
      trigger: "lesson_completed",
      triggerThreshold: 1,
      firstTimeReward: 50,
      createdAt: new Date(),
    },
    {
      name: "Leerling",
      description: "Voltooi 5 lessen.",
      trigger: "lesson_completed",
      triggerThreshold: 5,
      firstTimeReward: 100,
      createdAt: new Date(),
    },
    {
      name: "Muntenverzameler",
      description: "Verdien 500 munten.",
      trigger: "coins_earned",
      triggerThreshold: 500,
      firstTimeReward: 150,
      createdAt: new Date(),
    },
    {
      name: "Avatar meester",
      description: "Pas je avatar aan.",
      trigger: "avatar_customized",
      triggerThreshold: 1,
      firstTimeReward: 25,
      createdAt: new Date(),
    },
  ];

  for (const achievement of achievements) {
    await db.collection("achievements").findOneAndUpdate(
      { name: achievement.name },
      { $setOnInsert: achievement },
      { upsert: true }
    );
  }

    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
