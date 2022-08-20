import mongoose from 'mongoose';

export const FamilyMember = mongoose.model('FamilyMember', new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
}));