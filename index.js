import mongoose from 'mongoose';
import express from 'express';
const app = express();


mongoose.connect('mongodb://localhost/householdexpenses')
.then(() => console.log('connected to MongoDB'))
.catch(err => console.error('could not connect to MongoDB: ', err));

// put routes here -> app.use('/somerout', name)
app.use(express.json());

const port  = 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

app.get('/', (req, res) => {
    res.send('Househould Expenses');
});