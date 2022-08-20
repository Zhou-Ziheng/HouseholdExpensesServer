import mongoose from 'mongoose';
import { familyMemberSchema } from './family-member';

export const Family = mongoose.model('Family', new mongoose.Schema({
    familyName: {
        type: String,
        required: true
    },
    totalAllowance: Number,
    familyMembers: [familyMemberSchema]
}));

