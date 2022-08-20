import express from 'express';
import { Expense } from '../models/expense.js';
import { Category } from '../models/category.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const expenses = await Expense.find().sort('name');
    res.send(expenses);
});


router.get('/:id', async(req, res) => {
    try{
        const expense = await Expense.findById(req.params.id);
        res.send(expense);
    } catch(ex) {
        return res.status(404).send('The expense with the given ID was not found');
    }
});

router.post('/', async(req, res) => {
    let categories = [];

    for (let i = 0; i < (req.body.categoryIds).length; i++) {
        const categoryId = req.body.categoryIds[i];
        const category = await Category.findById(categoryId);
        if (!category) return res.status(400).send('Invalid category ID');
        categories.push(category);
    }
   
    let expense = new Expense({
        categories: categories
    });
    try {
        expense = await expense.save();
    } catch(ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
    res.send(expense);
});

router.put('/:id', async (req, res) => {
    try {
        let categories = [];

        for (let i = 0; i < (req.body.categoryIds).length; i++) {
        const categoryId = req.body.categoryIds[i];
        const category = await Category.findById(categoryId);
        if (!category) return res.status(400).send('Invalid category ID');
        categories.push(category);
     }

        const expense = await Expense.findByIdAndUpdate(req.params.id, {
            categories: categories
        }, {
            new: true
        });
        res.send(expense);
    } catch(ex) {
        return res.status(404).send('The expense with the given ID was not found');
    }
});

router.delete('/:id', async (req, res)  => {
    try {
        const expense  = await Expense.findByIdAndRemove(req.params.id)
        res.send(expense);
    }
    catch(ex){
        return res.status(404).send('The expense with the given ID was not found');
    }
});

export {router as expenses};