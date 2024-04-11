// server.js

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const User = require('./userModel'); // Import the User model

const mongoString = process.env.DATABASE_URL;
const port = process.env.PORT || 3000;

mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;

database.on('error', (error) => {
    console.error('Database connection error:', error);
});

database.once('open', () => {
    console.log('Database Connected');
});

const app = express();
app.use(cors());
app.use(express.json());

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    
    // Validate the request against the schema
    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        // Create a new user
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate the request against the schema
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        // Check if the password matches
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
