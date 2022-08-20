import mongoose from 'mongoose';
import { categorySchema } from './category.js';
import Joi from 'joi';

//add password
export const familyMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    allowance: Number,
    used: Number,
    categories: [categorySchema],
    familyId: String
});

export const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);

function validateFamilyMemeber(familyMember) {
    const schema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        allowance: Joi.number(),
        familyId: Joi.number(),
        categoryIds: Joi.array().items(Joi.string())
    });

    const result = schema.validate(familyMember);
    return result;
}

export {validateFamilyMemeber as validate};

