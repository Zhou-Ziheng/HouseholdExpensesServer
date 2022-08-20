import mongoose from 'mongoose';
import { familyMemberSchema } from './family-member.js';

export const Family = mongoose.model('Family', new mongoose.Schema({
    familyName: {
        type: String,
        required: true
    },
    totalAllowance: Number,
    totalUsed: Number,
    familyMembers: [familyMemberSchema]
}));

