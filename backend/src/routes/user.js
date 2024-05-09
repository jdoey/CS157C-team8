const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { UserCredentials } = require("../models/userCredentials");
const { UserProfile } = require("../models/userProfile");
const { checkLoggedIn } = require("../middleware/authMiddleware");
const { getBucket } = require("../db");
const fs = require("fs");
const crypto = require("crypto");

const multer = require("multer");
const mongoose = require("mongoose");

// set up connection to db for file storage
const { GridFsStorage } = require("multer-gridfs-storage");
const storage = GridFsStorage({
  db: mongoose.connection,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "photos",
    };
  },
});
const photosUpload = multer({ storage: storage }).array("photos", 3);

router.get("/getPhotos/:id", async (req, res) => {
  try {
    const bucket = getBucket();
    const f = req.params.id + ".jpg";
    if (!fs.existsSync(__dirname + "/../../img/" + f)) {
      const stream = bucket
        .openDownloadStream(new ObjectId(req.params.id))
        .pipe(fs.createWriteStream(__dirname + "/../../img/" + f));
      await new Promise((resolve) => stream.on("finish", resolve));
    }
    res.sendFile(f, { root: __dirname + "/../../img/" }, (err) => {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getProfile", checkLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const userProfile = await UserProfile.findOne({
      user_id: new ObjectId(userId), // Use ObjectId to convert userId to ObjectId
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json(userProfile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getProfile/:profileId", checkLoggedIn, async (req, res) => {
  try {
    const profileId = req.params.profileId;
    const userProfile = await UserProfile.findOne({
      _id: profileId,
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json(userProfile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/getNearbyProfiles", checkLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user._id;

    const userProfile = await UserProfile.findOne({
      user_id: new ObjectId(userId),
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const profiles = await UserProfile.find({
      user_id: { $ne: new ObjectId(userId) },
      loc: {
        $geoWithin: {
          $centerSphere: [userProfile.loc.coordinates, 20 / 3963.2], //10 mile??
        },
      },
    });

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ message: "No profiles found" });
    }

    return res.status(200).json(profiles);
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
      photos,
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
          photos: photos,
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

router.post("/uploadPhotos", checkLoggedIn, photosUpload, async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    }
    res.status(200).send({ ids: req.files.map((file) => file.id) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
