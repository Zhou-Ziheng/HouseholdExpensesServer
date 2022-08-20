import express from 'express';
import { Category } from '../models/category.js';
import { Item } from '../models/item.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const category = await Category.find().sort('name');
    res.send(category);
});


router.get('/:id', async(req, res) => {
    try{
        const category = await Category.findById(req.params.id);
        res.send(category);
    } catch(ex) {
        return res.status(404).send('The category with the given ID was not found');
    }
});

router.post('/', async(req, res) => {

    let items = [];
    let totalAmount = 0;

    for (let i = 0; i < (req.body.itemIds).length; i++ ) {
        const itemId = req.body.itemIds[i];
        const item = await Item.findById(itemId);
        if (!item) return res.status(400).send('Invalid item ID');
        items.push(item);
        totalAmount += item.cost;
    }
    console.log(totalAmount);
    // below alternative wasn't really working
    // for (let itemId in req.body.itemIds){
    //     const item = await Item.findById(itemId);
    //     if (!item) return res.status(400).send('Invalid item ID');
    //     items.push(item);
    // }
   
    let category = new Category({
        name: req.body.name,
        items: items,
        totalAmount: totalAmount
    });
    try {
        category = await category.save();
    } catch(ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
    res.send(category);
});

router.put('/:id', async (req, res) => {
    try {
        let items = [];
        let totalAmount = 0;

        for (let i = 0; i < (req.body.itemIds).length; i++) {
            const itemId = req.body.itemIds[i];
            const item = await Item.findById(itemId);
            if (!item) return res.status(400).send('Invalid item ID');
            items.push(item);
            totalAmount += item.cost;
        }
        const category = await Category.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            totalAmount: totalAmount,
            items: items
        }, {
            new: true
        });
        res.send(category);
    } catch(ex) {
        console.log(ex);
        return res.status(404).send('The category with the given ID was not found');
    }
});

router.delete('/:id', async (req, res)  => {
    try {
        const category  = await Category.findByIdAndRemove(req.params.id)
        res.send(category);
    }
    catch(ex){
        return res.status(404).send('The category with the given ID was not found');
    }
});

export {router as categories};