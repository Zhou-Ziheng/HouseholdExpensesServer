import mongoose from 'mongoose';
import { itemSchema } from './item';

export const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [itemSchema]
});

export const Category = mongoose.model('Category', categorySchema);