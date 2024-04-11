require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');


const mongoString = process.env.DATABASE_URL
const port = 3000;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
app.use(cors())
app.use(express.json());

const authRoutes = require('./src/routes/auth');

app.use('/auth', authRoutes)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

