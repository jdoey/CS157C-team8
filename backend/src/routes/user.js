const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { UserCredentials } = require("../models/userCredentials");
const { UserProfile } = require("../models/userProfile");
const { checkLoggedIn } = require("../middleware/authMiddleware");

router.get("/getProfile", checkLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    // console.log(userId);
    const userProfile = await UserProfile.findOne({
      user_id: new ObjectId(userId), // Use ObjectId to convert userId to ObjectId
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // console.log(userProfile);
    return res.status(200).json(userProfile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getOtherProfile", checkLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;

    const userProfile = await UserProfile.findOne({
      user_id: new ObjectId(userId),
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // const { coordinates } = userProfile.loc.coordinates;

    const profiles = await UserProfile.find({
      user_id: { $ne: new ObjectId(userId) },
      loc: {
        $geoWithin: {
          $centerSphere: [userProfile.loc.coordinates, 10 / 3963.2],
        },
      },
    });

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ message: "No profiles found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getUserLoc", checkLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const userProfile = await UserProfile.findOne({
      user_id: new ObjectId(userId),
    });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    const { coordinates } = userProfile.loc;
    return res.status(200).json({ coordinates });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/updateLocation", checkLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const userProfile = await UserProfile.findOne({
      user_id: new ObjectId(userId),
    });
    const coordinates = req.body.coordinates;

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const result = await UserProfile.updateOne(
      { user_id: new ObjectId(userId) },
      { $set: { loc: { type: "Point", coordinates: coordinates } } }
    );
    res.status(200).json({ message: "User Location Updated" });
  } catch (err) {
    console.log(`ERROR UPDATING USER INFO: ${err}`);
    return res
      .status(400)
      .send("Something went wrong when trying to update user location");
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
