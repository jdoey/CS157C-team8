const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "DirectMessage" },
    timestamp: { type: Date, default: Date.now },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = { Conversation };