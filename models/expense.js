import mongoose from 'mongoose';
import { categorySchema } from './category';

export const expensesSchema = new mongoose.Schema({
    categories: [categorySchema]
});

export const Expense = mongoose.model('Expense', expensesSchema);