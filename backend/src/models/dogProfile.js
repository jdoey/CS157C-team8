const mongoose = require('mongoose');

const dogProfileSchema = new mongoose.Schema({
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserCredentials', required: true },
    name: String,
    breed: String,
    age: Number,
    gender: String,
    size: String,
    color: String,
    weight: Number,
    personality: [String],
    habits: [String],
    isRescue: Boolean,
    bio: String,
    photos: [
        {
            url: String, // URL or file path of the picture
            caption: String // Optional caption for the picture
        }
    ],
    likes: [String],
    dislikes: [String],
    medicalHistory: {
        allergies: [String],
        medications: [String],
        surgeries: [String],
        vaccinations: {
            rabies: Date,
            distemper: Date,
            parvovirus: Date,
            kennelCough: Date,
            others: [String]
        }
    },
    prompts: [{
        prompt: String,
        answer: String,
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now }
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const DogProfile = mongoose.model('DogProfile', dogProfileSchema);

module.exports = { DogProfile };
