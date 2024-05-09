const express = require("express");
const { ObjectId } = require("mongodb");
const { UserProfile } = require("../models/userProfile");
const { DirectMessage } = require("../models/directMessage");
const { Conversation } = require("../models/conversation");
const { checkLoggedIn } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => res.send("Hello World!"));

router.post("/messages/send", checkLoggedIn, async (req, res) => {
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

router.get("/messages/:conversationId", checkLoggedIn, async (req, res) => {
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

router.get("/conversations/:profileId", checkLoggedIn, async (req, res) => {
    try {
        const profileId = req.params.profileId;
        const conversations = await Conversation.find({ users: profileId }).populate({ path: 'users', select: 'ownerName'}).populate('latestMessage');
        res.status(200).json(conversations);
    } catch (err) {
        console.error("Error retrieving conversations: ", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

// router.get("/conversations/exist", checkLoggedIn, async (req, res) => {
//     try {

//     } catch (err) {
//         console.error("Error checking if conversation exists: ", err);
//         res.status(500).json({ message: "Internal Server Error"});
//     }
// });

router.post("/conversations", checkLoggedIn, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const userProfile = await UserProfile.findOne({
            user_id: new ObjectId(userId),
        });
        const self = userProfile._id;
        console.log(self);
        const target = req.body;
        console.log(target.user);

        const conversationExists = await Conversation.findOne({
            users: { $all: [self, target.user] }
        });

        if (conversationExists) {
            console.log("conversation exists")
            res.status(200).json({ conversation: conversationExists, loggedInUserProfile: userProfile });
        } else {
            console.log("creating new conversation")
            const newConversation = new Conversation({
                users: [self, target.user],
            });
    
            await newConversation.save();
            res.status(201).json({ conversation: newConversation, loggedInUserProfile: userProfile});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create conversation' });
    }
  });

module.exports = router;