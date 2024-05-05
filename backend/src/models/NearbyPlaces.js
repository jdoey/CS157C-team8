const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    address: String,
    description: String,
    facilities: [String],
    hours: String,
    fees: String,
    amenities: [String],
    availableTimes: [{
        date: {
            type: Date,
            required: true
        },
        slots: [String]
    }]
}, { timestamps: true });

placeSchema.index({ 'location': '2dsphere' });

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
