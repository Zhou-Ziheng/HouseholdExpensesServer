import mongoose from 'mongoose';
import express from 'express';
import { familyMembers } from './routes/family-members.js';
import { items } from './routes/items.js';
import { categories } from './routes/categories.js';
import { families } from './routes/families.js';
// import { expenses } from './routes/expenses.js';
const app = express();


mongoose.connect('mongodb://localhost/householdexpenses')
.then(() => console.log('connected to MongoDB'))
.catch(err => console.error('could not connect to MongoDB: ', err));

app.use(express.json());
app.use('/api/family-members', familyMembers);
app.use('/api/items', items);
app.use('/api/categories', categories);
app.use('/api/families', families);
// app.use('/api/expenses', expenses);


const port  = 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

app.get('/', (req, res) => {
    res.send('Househould Expenses');
});