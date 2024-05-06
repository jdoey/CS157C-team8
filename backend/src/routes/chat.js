const express = require("express");
const bcrypt = require("bcryptjs");
const { UserProfile } = require("../models/userProfile");
const { DirectMessage } = require("../models/directMessage");
const { Conversation } = require("../models/conversation");

const router = express.Router();

router.get("/", (req, res) => res.send("Hello World!"));

router.post("/messages/send", async (req, res) => {
    try {
        const { sender, receiver, content, conversation } = req.body;

        const newMessage = new DirectMessage({
            sender,
            receiver,
            content,
            conversation
        });

        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error: Message failed to send" })
    }
})

router.get("/messages/:conversationId", async (req, res) => {
    try {
        const { conversationId } = req.params;

        const messages = await DirectMessage.find({
            conversation: conversationId
        })
        .populate('sender receiver', 'ownerName')
        .sort({ timestamp: 'asc' })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error retrieving message history: ", error);
        res.status(500).json({ message: 'Internal server error'});
    }
})

router.get("/conversations/:profileId", async (req, res) => {
    try {
        const profileId = req.params.profileId;
        const conversations = await Conversation.find({ users: profileId }).populate({ path: 'users', select: 'ownerName'}).populate('latestMessage');
        res.status(200).json(conversations);
    } catch (err) {
        console.error("Error retrieving conversations: ", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

module.exports = router;