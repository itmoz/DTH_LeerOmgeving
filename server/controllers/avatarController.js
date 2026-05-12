import { connectDB } from "../database.js";
import { parseBody } from "../utils.js";
import { ObjectId } from "mongodb";

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
    if (!email || !categoryId || !itemId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "email, categoryId and itemId required" }));
    }

    const db = await connectDB();

    await db.collection("equipped_items").updateOne(
      { email, category_id: new ObjectId(categoryId) },
      { $set: { item_id: new ObjectId(itemId), updatedAt: new Date() } },
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
    await db.collection("users").updateOne({ email }, { $set: { avatar: selections } });

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: true }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}
