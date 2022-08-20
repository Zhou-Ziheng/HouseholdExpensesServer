import express from 'express';
import { FamilyMember } from '../models/family-member.js';
import { Expense } from '../models/expense.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const familyMembers = await FamilyMember.find().sort('name');
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
    // can use this for recurring expenses
    // or should you just add an expense without needing it to be previously created
    let expenses = [];

    for (let i = 0; i < req.body.expenseIds.length; i++ ){
        const expense = await Expense.findById(req.body.expenseId);
        if (!expense) return res.status(400).send('Invalid expense ID');
        expenses.push(expense);
    }
    // const expense = await Expense.findById(req.body.expenseId);
    // if (!expense) return res.status(400).send('Invalid expense ID');


    // not sure if this is right
    let familyMember = new FamilyMember({
        name: req.body.name,
        username: req.body.username,
        allowance: req.body.allowance,
        expenses: expenses
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