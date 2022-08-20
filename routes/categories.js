import express from 'express';
import { Category } from '../models/category';

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
   
    let category = new Category({
        name: req.body.name,
        items: req.body.items
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
        const category = await Category.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            items: req.body.items
        }, {
            new: true
        });
        res.send(category);
    } catch(ex) {
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