const express = require("express");
const bcrypt = require("bcryptjs");
const { UserProfile } = require("../models/userProfile");
const { DirectMessage } = require("../models/directMessage");

const router = express.Router();

router.get("/", (req, res) => res.send("Hello World!"));

router.get("/message/send", async (req, res) => {
    try {
        const { sender, receiver, content } = req.body;

        const newMessage = new DirectMessage({
            sender,
            receiver,
            content,
        });

        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error: Message failed to send" })
    }
})

router.get("/messages/:senderId/:receiverId", async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const messages = await DirectMessage.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId}
            ]
        })
        .populate('sender receiver', 'name')
        .sort({ timestamp: 'asc' })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error retrieving message history:", error);
        res.status(500).json({ message: 'Internal server error'});
    }
})

module.exports = router;