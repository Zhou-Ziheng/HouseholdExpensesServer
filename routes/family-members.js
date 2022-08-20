import express from 'express';
import { FamilyMember } from '../models/family-member.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const familyMembers = await FamilyMember.find().sort('firstName');
    res.send(familyMembers);
});

router.get('/:id', async(req, res) => {
    try{
        const familyMember = await FamilyMember.findById(req.params.id);
        res.send(familyMember);
    } catch(ex) {
        return res.status(404).send('The family member with the given ID was not found');
    }
});

router.post('/', async(req, res) => {
    let familyMember = new FamilyMember({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    try {
        familyMember = await familyMember.save();
    } catch(ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
    res.send(familyMember);
});

router.put('/:id', async (req, res) => {
    try {
        const familyMember = await FamilyMember.findByIdAndUpdate(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }, {
            new: true
        });
        res.send(familyMember);
    } catch(ex) {
        return res.status(404).send('The family member with the given ID was not found');
    }
});

router.delete('/:id', async (req, res)  => {
    try {
        const familyMember  = await FamilyMember.findByIdAndRemove(req.params.id)
        res.send(familyMember);
    }
    catch(ex){
        return res.status(404).send('The family member with the given ID was not found');
    }
});

export {router as familyMembers};