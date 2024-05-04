const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserCredentials",
    required: true,
  },
  ownerName: String,
  city: String,
  state: String,
  loc: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  bio: String,
  photos: [String],
  birthday: Date,
  gender: String,
  ownerPrompts: [
    {
      prompt: String,
      answer: String,
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
    },
  ],
  dogs: [
    {
      name: String,
      breed: String,
      age: Number,
      gender: String,
      photos: [String],
      dogPrompts: [
        {
          prompt: String,
          answer: String,
          created_at: { type: Date, default: Date.now },
          updated_at: { type: Date, default: Date.now },
        },
      ],
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
    },
  ],
  directMessageUserList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = { UserProfile };
