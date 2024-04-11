
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    income: Number,
    gender: String,
    location: String,
    bio: String,
    budget: Number,
    preferences: {
        size: [String],
        age: {
            min: Number,
            max: Number
        },
        breed: [String],
        activityLevel: String,
        temperament: [String]
    },
    matchedDogs: [{
        dog_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DogProfile' },
        matchPercentage: Number
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
