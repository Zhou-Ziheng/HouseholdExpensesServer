import express from 'express';
import { FamilyMember } from '../models/family-member.js';
import { Family, validate } from '../models/family.js';

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
  const user = await FamilyMember.findOne({ _id: req.cookies.userid });

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

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.body.familyMemberIds) {
        let famMembs = [];
        let totalAllowance = 0;
        let totalUsed = 0;
        for (let i = 0; i < (req.body.familyMemberIds).length; i++ ){
            const famMembId = req.body.familyMemberIds[i];
            const famMemb = await FamilyMember.findById(famMembId);
            if (!famMemb) return res.status(400).send('Invalid family member ID');
            famMembs.push(famMemb);
            totalUsed += famMemb.used;
            totalAllowance += famMemb.allowance;
        }
       
        let family = new Family({
           familyName: req.body.familyName,
           totalAllowance: totalAllowance,
           totalUsed: totalUsed,
           familyMembers: famMembs
        });
        try {
            family = await family.save();
        }  catch(ex) {
            for (let i = 0; i < (ex.errors).length; i++) {
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
         }  catch(ex) {
             for (let i = 0; i < (ex.errors).length; i++) {
                 console.log(ex.errors[i].message);
             }
             res.status(400).send(ex);
         }
         res.send(family);
    }
    
});

// need to update here
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (req.body.familyMemberIds){
        let famMembs = [];
        let totalAllowance = 0;
        let totalUsed = 0;

        for (let i = 0; i < (req.body.familyMemberIds).length; i++ ){
            const famMembId = req.body.familyMemberIds[i];
            const famMemb = await FamilyMember.findById(famMembId);
            if (!famMemb) return res.status(400).send('Invalid family member ID');
            famMembs.push(famMemb);
            totalUsed += famMemb.used;
            totalAllowance += famMemb.allowance;
        }
        try {
            const family = Family.findByIdAndUpdate(req.params.id, {
                familyName: req.body.familyName,
                totalAllowance: totalAllowance,
                familyMembers: famMembs,
                totalUsed: totalUsed
             }, {
                new: true
            });
            res.send(family);
        } catch(ex) {
            return res.status(404).send('The family with the given ID was not found');
        }
    } else {
        try {
            const family = Family.findByIdAndUpdate(req.params.id, {
                familyName: req.body.familyName
             }, {
                new: true
            });
            res.send(family);
        } catch(ex) {
            return res.status(404).send('The family with the given ID was not found');
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
