require("dotenv").config();
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");

const authRoute = require("./src/routes/auth");
const userRoute = require("./src/routes/user");
const chatRoute = require("./src/routes/chat");
const placeRoute = require("./src/routes/Places");

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
app.use("/Places", placeRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.handshake.auth.profileId}`);
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      socketId: id,
      userId: socket.userId,
      profileId: socket.profileId
    });
    socket.emit("users", users);
    console.log(users);
  }

  // socket.on("authenticate", (userId) => {
  //   socket.userId = userId;
  //   console.log(`User ${userId} authenticated`);
  // });

  // socket.emit("session", {
  //   sessionID: socket.sessionID,
  //   userID: socket.userID,
  // });

  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(`User with ID: ${socket.profileId} joined room: ${conversationId}`);
  });

  socket.on("sendMessage", (data) => {
    socket.to(data.room).emit("receiveMessage", data);
  });

  socket.on("logout", () => {
    socket.disconnect();
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.on("connect_error", (err) => {
    console.log(err);
  });
});

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  const profileId = socket.handshake.auth.profileId;
  if (!userId) {
    return next(new Error("invalid user"));
  }
  socket.userId = userId;
  socket.profileId = profileId;
  next();
});

// io.use((socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;
//   if (sessionID) {
//     // find existing session
//     const session = sessionStore.findSession(sessionID);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userID = session.userID;
//       return next();
//     }
//   }
//   const userId = socket.handshake.auth.userId;
//   if (!userId) {
//     return next(new Error("invalid user"));
//   }
//   // create new session
//   socket.sessionID = randomId();
//   socket.userID = userId;
//   next();
// });

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
