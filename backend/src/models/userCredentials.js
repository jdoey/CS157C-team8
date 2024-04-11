const mongoose = require('mongoose');

const userCredentialsSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const UserCredentials = mongoose.model('UserCredentials', userCredentialsSchema);

module.exports = { UserCredentials };