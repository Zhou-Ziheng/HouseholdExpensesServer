import express from "express";
import { FamilyMember } from "../models/family-member.js";
import { Family } from "../models/family.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const families = await Family.find().sort("name");
  res.send(families);
});

router.get("/:id", async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    res.send(family);
  } catch (ex) {
    return res.status(404).send("The family with the given ID was not found");
  }
});

router.post("/new", async (req, res) => {
  console.log(req);
  const user = await FamilyMember.findOne({ _id: req.cookies });

  let family = new Family({
    familyName: req.body.familyName,
    totalAllowance: 0,
    totalUsed: 0,
    admins: [user],
    familyMembers: [user],
  });

  try {
    user.family = family._id;
    await user.save();
    family = await family.save();
  } catch (ex) {
    console.log(ex);
    // for (field in ex.errors) {
    //     console.log(ex.errors[field].message);
    // }
  }
  res.send(family);
});

router.post("/:id", async (req, res) => {
  let famMembs = [];
  let totalAllowance = 0;
  let totalUsed = 0;
  for (let i = 0; i < req.body.familyMemberIds.length; i++) {
    const famMembId = req.body.familyMemberIds[i];
    const famMemb = await FamilyMember.findById(famMembId);
    if (!famMemb) return res.status(400).send("Invalid family member ID");
    famMembs.push(famMemb);
    totalUsed += famMemb.used;
    totalAllowance += famMemb.allowance;

    // for (let i = 0; i < (expense.categories).length; i++) {
    //     used += expense.categories[i].totalAmount
    // }
  }

  let family = new Family({
    familyName: req.body.familyName,
    totalAllowance: 0,
    totalUsed: 0,
    familyMembers: famMembs,
  });
  try {
    family = await family.save();
  } catch (ex) {
    console.log(ex);
    // for (field in ex.errors) {
    //     console.log(ex.errors[field].message);
    // }
  }
  res.send(family);
});

// need to update here
router.put("/:id", async (req, res) => {
  try {
    const family = Family.findByIdAndUpdate(
      req.params.id,
      {
        familyName: req.body.familyName,
        totalAllowance: req.body.totalAllowance,
        familyMembers: req.body.familyMembers,
      },
      {
        new: true,
      }
    );
    res.send(family);
  } catch (ex) {
    return res.status(404).send("The family with the given ID was not found");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const family = await Family.findByIdAndRemove(req.params.id);
    res.send(family);
  } catch (ex) {
    return res.status(404).send("The family with the given ID was not found");
  }
});

export { router as families };
