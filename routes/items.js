import express from 'express';
import { Item } from '../models/item.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const item = await Item.find().sort('name');
    res.send(item);
});


router.get('/:id', async(req, res) => {
    try{
        const item = await Item.findById(req.params.id);
        res.send(item);
    } catch(ex) {
        return res.status(404).send('The item with the given ID was not found');
    }
});

router.post('/', async(req, res) => {
   
    let item = new Item({
        title: req.body.title,
        description: req.body.description,
        cost: req.body.cost,
        date: req.body.date
    });
    try {
        item = await item.save();
    } catch(ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
    res.send(item);
});

router.put('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            cost: req.body.cost,
            date: req.body.date
        }, {
            new: true
        });
        res.send(item);
    } catch(ex) {
        return res.status(404).send('The item with the given ID was not found');
    }
});

router.delete('/:id', async (req, res)  => {
    try {
        const item  = await Item.findByIdAndRemove(req.params.id)
        res.send(item);
    }
    catch(ex){
        return res.status(404).send('The item with the given ID was not found');
    }
});

export {router as items};