import express from 'express';
import { Item, validate } from '../models/item.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const item = await Item.find().sort('title');
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
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
   
    let item = new Item({
        title: req.body.title,
        description: req.body.description,
        cost: req.body.cost,
        date: req.body.date
    });
    try {
        item = await item.save();
    } catch(ex) {
        for (let i = 0; i < (ex.errors).length; i++) {
            console.log(ex.errors[i].message);
        }
        res.status(400).send(ex);
    }
    res.send(item);
});

router.put('/:id', async (req, res) => {

    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
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