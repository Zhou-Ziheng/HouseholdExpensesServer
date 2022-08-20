import mongoose from 'mongoose';

export const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    cost: {
        type: Number,
        required: true
    },
    date: Date
});

export const Item = mongoose.model('Item', itemSchema);