import { connectDB } from "../database.js";
import { parseBody } from "../utils.js";
import { ObjectId } from "mongodb";

const REQUIRED_AVATAR_CATEGORIES = ["shape", "color", "face"];
const OPTIONAL_AVATAR_CATEGORIES = ["accessory", "title"];
const DEFAULT_AVATAR_SELECTION_NAMES = {
  shape: "Round",
  color: "Red",
  face: "Happy",
  accessory: null,
  title: null,
};

const toObjectId = (value) => {
  if (!value || typeof value !== "string" || !ObjectId.isValid(value)) {
    return null;
  }

  return new ObjectId(value);
};

const toSelectionPayload = (item) => {
  if (!item) return null;

  return {
    id: item._id.toString(),
    name: item.name,
    price: item.price || 0,
    color_hex: item.color_hex || null,
  };
};

async function resolveSelectionForCategory(db, categoryDoc, selection, fallbackName) {
  if (!categoryDoc) {
    return null;
  }

  const itemsColl = db.collection("items");
  const categoryId = categoryDoc._id;
  const selectionId = toObjectId(selection?.id);

  if (selectionId) {
    const selectedById = await itemsColl.findOne({ _id: selectionId, category_id: categoryId });
    if (selectedById) {
      return toSelectionPayload(selectedById);
    }
  }

  if (selection?.name) {
    const selectedByName = await itemsColl.findOne({ name: selection.name, category_id: categoryId });
    if (selectedByName) {
      return toSelectionPayload(selectedByName);
    }
  }

  if (!fallbackName) {
    return null;
  }

  const fallbackItem = await itemsColl.findOne({ name: fallbackName, category_id: categoryId });
  return fallbackItem ? toSelectionPayload(fallbackItem) : null;
}

export async function getCategories(req, res) {
  try {
    const db = await connectDB();
    const raw = await db.collection("categories").find().toArray();
    const categories = raw.map((c) => ({ id: c._id.toString(), name: c.name }));
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ categories }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

export async function getItems(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const categoryId = url.searchParams.get("categoryId");

    const db = await connectDB();
    const itemsColl = db.collection("items");

    const filter = categoryId ? { category_id: new ObjectId(categoryId) } : {};
    const raw = await itemsColl.find(filter).toArray();
    const items = raw.map((it) => ({
      id: it._id.toString(),
      name: it.name,
      price: it.price || 0,
      color_hex: it.color_hex || null,
      category_id: it.category_id ? it.category_id.toString() : null,
    }));

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ items }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

export async function getInventory(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const email = url.searchParams.get("email");
    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Email required" }));
    }

    const db = await connectDB();

    const pipeline = [
      { $match: { email } },
      {
        $lookup: {
          from: "items",
          localField: "item_id",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: "$item" },
      { $project: { inventory_id: "$_id", unlocked_at: 1, item: 1, _id: 0 } },
    ];

    const rawInv = await db.collection("inventory").aggregate(pipeline).toArray();
    const inventory = rawInv.map((inv) => ({
      inventory_id: inv.inventory_id?.toString() || null,
      unlocked_at: inv.unlocked_at,
      item: inv.item ? { id: inv.item._id.toString(), name: inv.item.name, price: inv.item.price || 0 } : null,
    }));

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ inventory }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

export async function purchaseItem(req, res) {
  try {
    const { email, itemId } = await parseBody(req);
    if (!email || !itemId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Email and itemId required" }));
    }

    const db = await connectDB();
    const users = db.collection("users");
    const items = db.collection("items");

    const user = await users.findOne({ email });
    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    const item = await items.findOne({ _id: new ObjectId(itemId) });
    if (!item) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Item not found" }));
    }

    const price = Number(item.price || 0);
    if ((user.balance || 0) < price) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Insufficient balance" }));
    }

    // decrement balance and add to inventory
    await users.updateOne({ email }, { $inc: { balance: -price } });

    const invRes = await db.collection("inventory").insertOne({
      email,
      item_id: item._id,
      unlocked_at: new Date(),
    });

    const updatedUser = await users.findOne({ email }, { projection: { balance: 1 } });

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true, balance: updatedUser.balance, inventoryId: invRes.insertedId.toString() }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

export async function equipItem(req, res) {
  try {
    const { email, categoryId, itemId } = await parseBody(req);
    if (!email || !categoryId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "email and categoryId required" }));
    }

    const db = await connectDB();
    const categoryObjectId = toObjectId(categoryId);
    if (!categoryObjectId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid categoryId" }));
    }

    const category = await db.collection("categories").findOne({ _id: categoryObjectId });
    if (!category) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Category not found" }));
    }

    if (!itemId) {
      if (REQUIRED_AVATAR_CATEGORIES.includes(category.name)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: `Cannot unequip required category: ${category.name}` }));
      }

      await db.collection("equipped_items").deleteOne({ email, category_id: categoryObjectId });

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: true, unequipped: true }));
    }

    const itemObjectId = toObjectId(itemId);
    if (!itemObjectId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid itemId" }));
    }

    const item = await db.collection("items").findOne({ _id: itemObjectId, category_id: categoryObjectId });
    if (!item) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Item not found" }));
    }

    await db.collection("equipped_items").updateOne(
      { email, category_id: categoryObjectId },
      { $set: { item_id: itemObjectId, updatedAt: new Date() } },
      { upsert: true }
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

export async function getEquipped(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const email = url.searchParams.get("email");
    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Email required" }));
    }

    const db = await connectDB();

    const pipeline = [
      { $match: { email } },
      {
        $lookup: {
          from: "items",
          localField: "item_id",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: { path: "$item", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, category: 1, item: 1, updatedAt: 1 } },
    ];

    const rawEq = await db.collection("equipped_items").aggregate(pipeline).toArray();
    const equipped = rawEq.map((e) => ({
      category: e.category ? { id: e.category._id.toString(), name: e.category.name } : null,
      item: e.item ? { id: e.item._id.toString(), name: e.item.name, price: e.item.price || 0 } : null,
      updatedAt: e.updatedAt || null,
    }));

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ equipped }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

export async function saveAvatar(req, res) {
  try {
    const { email, selections } = await parseBody(req);
    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Email required" }));
    }

    const db = await connectDB();
    const categoryDocs = await db.collection("categories").find().toArray();
    const categoryMap = new Map(categoryDocs.map((category) => [category.name, category]));

    const normalizedAvatar = {};

    for (const categoryName of [...REQUIRED_AVATAR_CATEGORIES, ...OPTIONAL_AVATAR_CATEGORIES]) {
      const categoryDoc = categoryMap.get(categoryName);
      const fallbackName = DEFAULT_AVATAR_SELECTION_NAMES[categoryName];
      const resolvedSelection = await resolveSelectionForCategory(
        db,
        categoryDoc,
        selections?.[categoryName],
        fallbackName
      );

      normalizedAvatar[categoryName] = resolvedSelection;

      if (!categoryDoc) {
        continue;
      }

      if (resolvedSelection) {
        await db.collection("equipped_items").updateOne(
          { email, category_id: categoryDoc._id },
          { $set: { item_id: new ObjectId(resolvedSelection.id), updatedAt: new Date() } },
          { upsert: true }
        );
      } else {
        await db.collection("equipped_items").deleteOne({ email, category_id: categoryDoc._id });
      }
    }

    await db.collection("users").updateOne({ email }, { $set: { avatar: normalizedAvatar } });

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}
