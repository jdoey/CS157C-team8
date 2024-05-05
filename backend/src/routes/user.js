const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { UserCredentials } = require("../models/userCredentials");
const { UserProfile } = require("../models/userProfile");
const { checkLoggedIn } = require("../middleware/authMiddleware");

router.get("/getProfile", checkLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    console.log(userId);
    const userProfile = await UserProfile.findOne({
      user_id: new ObjectId(userId), // Use ObjectId to convert userId to ObjectId
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    console.log(userProfile);
    return res.status(200).json(userProfile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/updateUser", checkLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user_id = new ObjectId(userId); // Use ObjectId to convert userId to ObjectId
    const {
      ownerName,
      gender,
      birthday,
      city,
      state,
      ownerPrompts: ownerPrompts,
      dogs: dogs,
    } = req.body;

    const result = await UserProfile.updateOne(
      { user_id },
      {
        $set: {
          ownerName: ownerName,
          gender: gender,
          birthday: birthday,
          city: city,
          state: state,
          ownerPrompts: ownerPrompts,
          dogs: dogs,
        },
      }
    );
    res.status(200).json({ message: "User info updated" });
  } catch (err) {
    console.log(err);
    console.log(`ERROR UPDATING USER INFO: ${err}`);
    res.status(500).json({ message: "ERROR UPDATING USER INFO" });
  }
});

module.exports = router;
