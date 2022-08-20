import express from 'express';
import { Family } from '../models/family.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const families = await Family.find().sort('name');
    res.send(families);
});


router.get('/:id', async(req, res) => {
    try{
        const family = await Family.findById(req.params.id);
        res.send(family);
    } catch(ex) {
        return res.status(404).send('The family with the given ID was not found');
    }
});

router.post('/', async(req, res) => {
   
    let family = new Family({
       familyName: req.body.familyName,
       totalAllowance: req.body.totalAllowance,
       familyMembers: req.body.familyMembers
    });
    try {
        family = await family.save();
    } catch(ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
    res.send(family);
});

router.put('/:id', async (req, res) => {
    try {
        const family = Family.findByIdAndUpdate(req.params.id, {
            familyName: req.body.familyName,
            totalAllowance: req.body.totalAllowance,
            familyMembers: req.body.familyMembers
         }, {
            new: true
        });
        res.send(family);
    } catch(ex) {
        return res.status(404).send('The family with the given ID was not found');
    }
});

router.delete('/:id', async (req, res)  => {
    try {
        const family  = await Family.findByIdAndRemove(req.params.id)
        res.send(family);
    }
    catch(ex){
        return res.status(404).send('The family with the given ID was not found');
    }
});

export {router as families};