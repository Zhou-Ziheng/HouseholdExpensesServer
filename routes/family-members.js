import express from "express";
import { FamilyMember, validate } from "../models/family-member.js";
// import { Expense } from '../models/expense.js';
import { Category } from "../models/category.js";
import { hash, verify } from "argon2";
import { Family } from "../models/family.js";
import mongoose from "mongoose";
import { addOneFamMember } from "../helper-functions.js";
import { Item } from "../models/item.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const familyMembers = await FamilyMember.find().sort("name");
  for (let i = 0; i < familyMembers.length; i++) {
    familyMembers[i] = await familyMembers[i].populate("categories");
  }
  res.send(familyMembers);
});

router.get("/:id", async (req, res) => {
  try {
    const familyMember = await FamilyMember.findById(req.params.id).populate({
      path: "categories",
      populate: {
        path: "items",
      },
    });
    res.send(familyMember);
  } catch (ex) {
    return res
      .status(404)
      .send("The family member with the given ID was not found");
  }
});

router.post("/signin", async (req, res) => {
  const familyMember = await FamilyMember.findOne({
    username: req.body.username,
  });

  try {
    console.log(req.body.password);
    console.log(familyMember.password);
    const verified = await verify(familyMember.password, req.body.password);
    if (verified) {
      res.cookie("userid", familyMember._id);
      res.send(familyMember);
      return;
    }
  } catch (ex) {
    console.log(ex);
  }

  res.send({ error: "invalid password/username" });
});

router.put("/addArray/:id", async (req, res) => {
  const familyMember = await FamilyMember.findById(req.params.id);

  const itemId = req.body.itemId;

  const item = await Item.findById(itemId);

  let category = new Category({
    category: req.body.category,
    totalAmount: item.cost,
    items: [mongoose.Types.ObjectId(itemId)],
  });

  try {
    category = await category.save();

    const oldCategories = familyMember.categories;
    oldCategories.push(mongoose.Types.ObjectId(category._id));
    await FamilyMember.findByIdAndUpdate(req.params.id, {
      name: familyMember.name,
      username: familyMember.username,
      categories: oldCategories,
      used: familyMember.used + item.cost,
    });
  } catch (ex) {
    console.log(ex);
  }

  res.send(category);
});

router.post("/signup", async (req, res) => {
  console.log(req.body.family);

  let familyMember;
  if (req.body.family) {
    // not sure if this is right
    familyMember = new FamilyMember({
      name: req.body.name,
      username: req.body.username,
      allowance: 1,
      categories: [],
      used: 0,
      familyId: req.body.family,
      password: await hash(req.body.password),
    });
  } else {
    familyMember = new FamilyMember({
      name: req.body.name,
      username: req.body.username,
      allowance: 1,
      categories: [],
      used: 0,
      familyId: "",
      password: await hash(req.body.password),
    });
  }

  try {
    familyMember = await familyMember.save();
    if (req.body.family)
      await addOneFamMember(familyMember._id, familyMember.familyId);
  } catch (ex) {
    console.log(ex);
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }

  res.cookie("userid", familyMember._id);
  res.send(familyMember);
});

// router.post("/", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   if (req.body.categoryIds) {
//     let categories = [];
//     let used = 0;

//     for (let i = 0; i < req.body.categoryIds.length; i++) {
//       const categoryId = req.body.categoryIds[i];
//       const category = await Category.findById(categoryId);
//       if (!category) return res.status(400).send("Invalid category ID");
//       categories.push(category);
//       used += category.totalAmount;
//     }

//     let familyMember = new FamilyMember({
//       name: req.body.name,
//       username: req.body.username,
//       allowance: req.body.allowance,
//       categories: categories,
//       used: used,
//       familyId: req.body.familyId,
//       password: req.body.password,
//     });

//     try {
//       familyMember = await familyMember.save();
//     } catch (ex) {
//       console.log(ex);
//       for (field in ex.errors) {
//         console.log(ex.errors[field].message);
//       }
//     }
//     res.send(familyMember);
//   } else {
//     let familyMember = new FamilyMember({
//       name: req.body.name,
//       username: req.body.username,
//       allowance: req.body.allowance,
//       familyId: req.body.familyId,
//       password: req.body.password,
//     });
//     try {
//       familyMember = await familyMember.save();
//     } catch (ex) {
//       for (let i = 0; i < ex.errors.length; i++) {
//         console.log(ex.errors[i].message);
//       }
//       res.status(400).send(ex);
//     }
//     res.send(familyMember);
//   }
// });

// make it so new categories don't just replace old ones

router.put("/:id", async (req, res) => {
  console.log("herer");
  if (req.body.categoryIds) {
    try {
      let categories = [];
      let used = 0;

      console.log(req.body.categoryIds);

      for (let i = 0; i < req.body.categoryIds.length; i++) {
        const categoryId = req.body.categoryIds[i];
        const category = await Category.findById(categoryId);
        if (!category) return res.status(400).send("Invalid category ID");
        categories.push(mongoose.Types.ObjectId(categoryId));
        used += category.totalAmount;
      }
      const familyMember = await FamilyMember.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          username: req.body.username,
          allowance: req.body.allowance,
          categories: categories,
          used: used,
          password: req.body.password,
          familyId: req.body.familyId,
        },
        {
          new: true,
        }
      );
      res.send(familyMember);
    } catch (ex) {
      console.log(ex);
      return res
        .status(404)
        .send("The family member with the given ID was not found");
    }
  } else {
    try {
      const familyMember = await FamilyMember.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          username: req.body.username,
          allowance: req.body.allowance,
          password: req.body.password,
          familyId: req.body.familyId,
        },
        {
          new: true,
        }
      );
      res.send(familyMember);
    } catch (ex) {
      console.log(ex);
      return res
        .status(404)
        .send("The family member with the given ID was not found");
    }
  }
});

router.put("/updateUsed/:id", async (req, res) => {
  let response;
  try {
    const familyMember = await (
      await FamilyMember.findById(req.params.id)
    ).populate("categories");

    let total = 0;
    const categories = familyMember.categories;
    categories?.forEach((category) => (total += category.totalAmount));

    response = await FamilyMember.findByIdAndUpdate(req.params.id, {
      name: familyMember.name,
      username: familyMember.username,
      used: total,
    });
  } catch {
    (e) => {
      console.log(e);
    };
  }
  res.send(response);
});

router.delete("/:id", async (req, res) => {
  try {
    const familyMember = await FamilyMember.findByIdAndRemove(req.params.id);
    res.send(familyMember);
  } catch (ex) {
    return res
      .status(404)
      .send("The family member with the given ID was not found");
  }
});

export { router as familyMembers };
