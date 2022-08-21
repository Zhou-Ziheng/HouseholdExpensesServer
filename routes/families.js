import express from "express";
import { FamilyMember } from "../models/family-member.js";
import { Family, validate } from "../models/family.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  const families = await Family.find().sort("name");
  for (let i = 0; i < families; i++) {
    families[i] = await (
      await families[i].populate("admins")
    ).populate("familyMembers");
  }
  res.send(families);
});

router.get("/:id", async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    const populatedFam = await (
      await family.populate("admins")
    ).populate({
      path: "familyMembers",
      populate: {
        path: "categories",
        populate: {
          path: "items",
        },
      },
    });
    res.send(populatedFam);
  } catch (ex) {
    return res.status(404).send("The family with the given ID was not found");
  }
});

router.post("/new", async (req, res) => {
  const user = await FamilyMember.findOne({ _id: req.cookies.userid });

  let family;

  if (user) {
    family = new Family({
      familyName: req.body.familyName,
      totalAllowance: 0,
      totalUsed: 0,
      admins: [mongoose.Types.ObjectId(req.cookies.userid)],
      familyMembers: [mongoose.Types.ObjectId(req.cookies.userid)],
    });
  }

  try {
    family.save();
    const updatedFam = await FamilyMember.findByIdAndUpdate(
      req.cookies.userid,
      {
        name: user.name,
        username: user.username,
        familyId: family._id,
      },
      {
        new: true,
      }
    );
  } catch (ex) {
    console.log(ex);
    // for (field in ex.errors) {
    //     console.log(ex.errors[field].message);
    // }
  }

  res.send(family);
});

// This is for when an existing user joins a family
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.familyMemberIds) {
    let famMembs = [];
    let totalAllowance = 0;
    let totalUsed = 0;
    for (let i = 0; i < req.body.familyMemberIds.length; i++) {
      const famMembId = req.body.familyMemberIds[i];
      const famMemb = await FamilyMember.findById(famMembId);
      if (!famMemb) return res.status(400).send("Invalid family member ID");
      famMembs.push(mongoose.Types.ObjectId(famMembId));
      totalUsed += famMemb.used;
      totalAllowance += famMemb.allowance;
    }

    let family = new Family({
      familyName: req.body.familyName,
      totalAllowance: totalAllowance,
      totalUsed: totalUsed,
      familyMembers: famMembs,
    });
    try {
      family = await family.save();
    } catch (ex) {
      for (let i = 0; i < ex.errors.length; i++) {
        console.log(ex.errors[i].message);
      }
      res.status(400).send(ex);
    }
    res.send(family);
  } else {
    let family = new Family({
      familyName: req.body.familyName,
    });
    try {
      family = await family.save();
    } catch (ex) {
      for (let i = 0; i < ex.errors.length; i++) {
        console.log(ex.errors[i].message);
      }
      res.status(400).send(ex);
    }
    res.send(family);
  }
});

// need to update here
router.put("/:id", async (req, res) => {
  console.log("in put");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.familyMemberIds) {
    let famMembs = [];
    let totalAllowance = 0;
    let totalUsed = 0;

    for (let i = 0; i < req.body.familyMemberIds.length; i++) {
      const famMembId = req.body.familyMemberIds[i];
      const famMemb = await FamilyMember.findById(famMembId);
      if (!famMemb) return res.status(400).send("Invalid family member ID");
      famMembs.push(mongoose.Types.ObjectId(famMembId));
      if (famMemb.used) totalUsed += famMemb.used;
      if (famMemb.allowance) totalAllowance += famMemb.allowance;
    }
    try {
      const family = await Family.findByIdAndUpdate(
        req.params.id,
        {
          familyName: req.body.familyName,
          totalAllowance: totalAllowance,
          familyMembers: famMembs,
          totalUsed: totalUsed,
        },
        {
          new: true,
        }
      );
      res.send(family);
    } catch (ex) {
      return res.status(404).send("The family with the given ID was not found");
    }
  } else {
    try {
      const family = await Family.findByIdAndUpdate(
        req.params.id,
        {
          familyName: req.body.familyName,
          totalAllowance: req.body.totalAllowance,
        },
        {
          new: true,
        }
      );
      res.send(family);
    } catch (ex) {
      return res.status(404).send("The family with the given ID was not found");
    }
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
