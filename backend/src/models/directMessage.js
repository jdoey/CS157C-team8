const mongoose = require('mongoose');

const directMessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
    content: { type: String, required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    timestamp: { type: Date, default: Date.now },
    updated_at: { type: Date }
});

const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);

module.exports = { DirectMessage };