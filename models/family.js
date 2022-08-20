import mongoose from 'mongoose';
import { familyMemberSchema } from './family-member.js';
import Joi from 'joi';

export const Family = mongoose.model('Family', new mongoose.Schema({
    familyName: {
        type: String,
        required: true
    },
    totalAllowance: Number,
    totalUsed: Number,
    familyMembers: [familyMemberSchema]
}));

function validateFamily(family) {
    const schema = Joi.object({
        familyName: Joi.string().required(),
        familyMemberIds: Joi.array().items(Joi.string())
    });

    const result = schema.validate(family);
    return result;
}

export {validateFamily as validate};

