import mongoose from 'mongoose';
// import { expensesSchema } from './expense.js';
import { categorySchema } from './category.js';

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
    categories: [categorySchema]
})

export const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);