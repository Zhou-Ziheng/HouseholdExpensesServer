import express from "express";
import mongoose from "mongoose";
import { addOneItem } from "../helper-functions.js";
import { Category, validate } from "../models/category.js";
import { Item } from "../models/item.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const category = await Category.find().sort("category");
  for (let i = 0; i < category.length; i++) {
    category[i] = await category[i].populate("items");
  }
  res.send(category);
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("items");
    res.send(category);
  } catch (ex) {
    return res.status(404).send("The category with the given ID was not found");
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let items = [];
  let totalAmount = 0;
  if (req.body.itemIds) {
    for (let i = 0; i < req.body.itemIds.length; i++) {
      const itemId = req.body.itemIds[i];
      items.push(mongoose.Types.ObjectId(itemId));
      const item = await Item.findById(itemId);
      if (!item) return res.status(400).send("Invalid item ID");
      totalAmount += item.cost;
    }

    let category = new Category({
      category: req.body.category,
      items: items,
      totalAmount: totalAmount,
    });
    try {
      category = await category.save();
    } catch (ex) {
      for (let i = 0; i < ex.errors.length; i++) {
        console.log(ex.errors[i].message);
      }
      res.status(400).send(ex);
    }
    res.send(category);
  } else {
    let category = new Category({
      category: req.body.category,
      items: [],
      totalAmount: 0,
    });
    try {
      category = await category.save();
    } catch (ex) {
      for (field in ex.errors) {
        console.log(ex.errors[field].message);
      }
    }
    res.send(category);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.itemIds) {
    try {
      let items = [];
      let totalAmount = 0;
      for (let i = 0; i < req.body.itemIds.length; i++) {
        const itemId = req.body.itemIds[i];
        items.push(mongoose.Types.ObjectId(itemId));
        const item = await Item.findById(itemId);
        if (!item) return res.status(400).send("Invalid item ID");
        totalAmount += item.cost;
      }
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
          category: req.body.category,
          totalAmount: totalAmount,
          items: items,
        },
        {
          new: true,
        }
      );
      res.send(category);
    } catch (ex) {
      console.log(ex);
      return res
        .status(404)
        .send("The category with the given ID was not found");
    }
  } else {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
          category: req.body.category,
        },
        {
          new: true,
        }
      );
      res.send(category);
    } catch (ex) {
      console.log(ex);
      return res
        .status(404)
        .send("The category with the given ID was not found");
    }
  }
});

router.put("/addItem/:id", async (req, res) => {
  console.log(req.cookies.userid);
  const response = addOneItem(
    req.body.itemId,
    req.params.id,
    req.cookies.userid
  );
  res.send(response);
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    res.send(category);
  } catch (ex) {
    return res.status(404).send("The category with the given ID was not found");
  }
});

export { router as categories };
