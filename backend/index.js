require("dotenv").config();
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

const authRoute = require("./src/routes/auth");
const userRoute = require("./src/routes/user");
const chatRoute = require("./src/routes/chat")

const mongoString = process.env.DATABASE_URL;
const port = 3001;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();

// express session
let TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const sessionConfig = session({
  secret: "keyboard cat",
  cookie: {
    maxAge: TIME,
  },
  resave: false,
  saveUninitialized: true,
});
app.use(sessionConfig);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/chat", chatRoute);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
