// userModel.js

const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
