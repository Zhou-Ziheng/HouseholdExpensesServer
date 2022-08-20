import mongoose from 'mongoose';
import { itemSchema } from './item.js';
import Joi from 'joi';

export const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    totalAmount: Number,
    items: [itemSchema]
});

export const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
    const schema = Joi.object({
        category: Joi.string().required(),
        itemIds: Joi.array().items(Joi.string())
    });

    const result = schema.validate(category);
    return result;
}

export { validateCategory as validate };
