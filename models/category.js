import mongoose from 'mongoose';
import { itemSchema } from './item.js';

export const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    totalAmount: Number,
    items: [itemSchema]
});

export const Category = mongoose.model('Category', categorySchema);