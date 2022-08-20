import mongoose from 'mongoose';
import { expensesSchema } from './expense';

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
    expenses: [expensesSchema]
})

export const FamilyMember = mongoose.model('FamilyMember', expensesSchema);