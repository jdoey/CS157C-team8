const express = require("express");
const bcrypt = require("bcryptjs");
const { UserCredentials } = require("../models/userCredentials");
const { UserProfile } = require("../models/userProfile");
const { checkLoggedIn } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", (req, res) => res.send("Hello World!"));

router.get("/test", checkLoggedIn, (req, res) => res.send("test success!"));

router.post("/login", async (req, res) => {
  console.log("login called");
  const { email, password } = req.body;

  const user = await UserCredentials.findOne({ email });

  if (!user) {
    console.log("Invalid email");
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    console.log("Invalid password");
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const userId = user._id;
  const profile = await UserProfile.findOne({ user_id: userId })
  req.session.user = user;
  return res.status(200).json({ message: "Login successful", userId: userId, profileId: profile._id});
});

router.post("/signup", async (req, res) => {
  console.log("sign up called");
  const {
    email,
    password,
    ownerName,
    gender,
    birthday,
    city,
    state,
    loc,
    petName,
    petBreed,
    petAge,
    petGender,
    ownerPrompts,
    dogPrompts,
  } = req.body;

  const existingUser = await UserCredentials.findOne({ email });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "An account with the provided email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserCredentials({
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    const userProfile = new UserProfile({
      user_id: newUser._id,
      ownerName: ownerName,
      city: city,
      state: state,
      loc: loc,
      birthday: birthday,
      gender: gender,
      ownerPrompts: ownerPrompts,
      dogs: [
        {
          name: petName,
          breed: petBreed,
          age: petAge,
          gender: petGender,
          bio: "",
          photos: [],
          dogPrompts: dogPrompts,
        },
      ],
    });
    await userProfile.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user" });
  }
});

router.get("/checkEmail", async (req, res) => {
  const { email } = req.query;
  try {
    const existingUser = await UserCredentials.findOne({ email });
    if (existingUser) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).send("Successfully logged out");
});

module.exports = router;
