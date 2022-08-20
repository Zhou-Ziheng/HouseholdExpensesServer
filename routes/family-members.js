import express from "express";
import { FamilyMember } from "../models/family-member.js";
// import { Expense } from '../models/expense.js';
import { Category } from "../models/category.js";
import { hash, verify } from "argon2";

const router = express.Router();

router.get("/", async (req, res) => {
  const familyMembers = await FamilyMember.find().sort("name");
  res.send(familyMembers);
});

router.get("/:id", async (req, res) => {
  try {
    const familyMember = await FamilyMember.findById(req.params.id);
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

router.post("/signup", async (req, res) => {
  console.log(req.body.family);
  // not sure if this is right
  let familyMember = new FamilyMember({
    name: req.body.name,
    username: req.body.username,
    allowance: 1,
    categories: [],
    used: 0,
    family: req.body.family,
    password: await hash(req.body.password),
  });

  try {
    familyMember = await familyMember.save();
  } catch (ex) {
    console.log(ex);
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }

  res.cookie("userid", familyMember._id);
  res.send(familyMember);
});

router.post("/:id", async (req, res) => {
  // can use this for recurring expenses
  // or should you just add an expense without needing it to be previously created
  let categories = [];
  let used = 0;

  if (req.body.categoryIds) {
    for (let i = 0; i < req.body.categoryIds.length; i++) {
      const categoryId = req.body.categoryIds[i];
      const category = await Category.findById(categoryId);
      if (!category) return res.status(400).send("Invalid category ID");
      categories.push(category);
      used += category.totalAmount;

      // for (let i = 0; i < (expense.categories).length; i++) {
      //     used += expense.categories[i].totalAmount
      // }
    }
  }
  // const expense = await Expense.findById(req.body.expenseId);
  // if (!expense) return res.status(400).send('Invalid expense ID');

  // not sure if this is right
  let familyMember = new FamilyMember({
    name: req.body.name,
    username: req.body.username,
    allowance: req.body.allowance,
    categories: categories,
    // used: used
  });

  try {
    familyMember = await familyMember.save();
  } catch (ex) {
    console.log(ex);
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }

  res.send(familyMember);
});

router.put("/:id", async (req, res) => {
  try {
    let categories = [];
    let used = 0;

    for (let i = 0; i < req.body.categoryIds.length; i++) {
      const categoryId = req.body.categoryIds[i];
      const category = await Category.findById(categoryId);
      if (!category) return res.status(400).send("Invalid category ID");
      categories.push(category);
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
      },
      {
        new: true,
      }
    );
    res.send(familyMember);
  } catch (ex) {
    return res
      .status(404)
      .send("The family member with the given ID was not found");
  }
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
