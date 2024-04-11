const express = require("express");
const bcrypt = require("bcryptjs");
const { UserCredentials } = require("../models/userCredentials");
const { UserProfile } = require("../models/userProfile");

const router = express.Router();

router.get("/", (req, res) => res.send("Hello World!"));

router.get("/test", (req, res) => res.send("test success!"));

router.post("/login", async (req, res) => {
  console.log("login called");
  const { email, password } = req.body;

  const user = await UserCredentials.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  return res.status(200).json({ message: "Login successful" });
});

router.post("/signup", async (req, res) => {
  console.log("sign up called");
  const { email, password } = req.body;

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
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user" });
  }
});

module.exports = router;
