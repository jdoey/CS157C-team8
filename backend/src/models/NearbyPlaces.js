const mongoose = require("mongoose");

const parkProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  contact: String,
  openHours: String,
  openDays: String,
  fees: String,
  amenities: [
    {
      feature: String,
      description: String
    }
  ],
  reviews: [
    {
      reviewer: String,
      text: String,
      rating: Number,
      created_at: { type: Date, default: Date.now }
    }
  ],
  events: [
    {
      title: String,
      description: String,
      date: Date
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Create a geospatial index to optimize location-based queries
parkProfileSchema.index({ location: '2dsphere' });

const ParkProfile = mongoose.model("ParkProfile", parkProfileSchema);

module.exports = ParkProfile;
