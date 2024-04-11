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
    console.log("Invalid email");
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    console.log("Invalid password");
    return res.status(401).json({ message: "Invalid username or password" });
  }

  return res.status(200).json({ message: "Login successful" });
});

router.post("/signup", async (req, res) => {
  console.log("sign up called");
  const {
    email,
    password,
    firstName,
    lastName,
    gender,
    birthday,
    zipcode,
    petName,
    petBreed,
    petAge,
    petGender,
    dogAns1,
    dogAns2,
    dogAns3,
    dogPrompt1,
    dogPrompt2,
    dogPrompt3,
    ownerAns1,
    ownerAns2,
    ownerAns3,
    ownerPrompt1,
    ownerPrompt2,
    ownerPrompt3,
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
      firstName: firstName,
      lastName: lastName,
      location: zipcode,
      //   age: birthday,
      birthday: birthday,
      gender: gender,
      ownerPrompts: [
        { prompt: ownerPrompt1, answer: ownerAns1 },
        { prompt: ownerPrompt2, answer: ownerAns2 },
        { prompt: ownerPrompt3, answer: ownerAns3 },
      ],
      dogs: [
        {
          name: petName,
          breed: petBreed,
          age: petAge,
          gender: petGender,
          bio: "",
          photos: [],
          dogPrompts: [
            { prompt: dogPrompt1, answer: dogAns1 },
            { prompt: dogPrompt2, answer: dogAns2 },
            { prompt: dogPrompt3, answer: dogAns3 },
          ],
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

module.exports = router;
