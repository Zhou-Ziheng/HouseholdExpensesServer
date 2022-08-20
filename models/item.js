import mongoose from 'mongoose';
import Joi from 'joi';

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

function validateItem(item) {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        cost: Joi.number().required(),
        date: Joi.date()
    });

    const result = schema.validate(item);
    return result;
}

export { validateItem as validate };