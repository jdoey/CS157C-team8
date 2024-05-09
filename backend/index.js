require("dotenv").config();
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const { Server } = require("socket.io");
const http = require("http");
const authRoute = require("./src/routes/auth");
const userRoute = require("./src/routes/user");
const chatRoute = require("./src/routes/chat");
require("./src/db");

const port = 3001;

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.engine.use(sessionConfig);

io.on("connection", (socket) => {
  console.log(`a user connected: ${socket.handshake.auth.profileId}`);
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      socketId: id,
      sessionId: socket.sessionId,
      userId: socket.userId,
      profileId: socket.profileId,
    });
    socket.emit("users", users);
    console.log(users);
  }

  // socket.on("authenticate", (userId) => {
  //   socket.userId = userId;
  //   console.log(`User ${userId} authenticated`);
  // });

  // socket.emit("session", {
  //   sessionId: socket.sessionId,
  //   userId: socket.userId,
  //   profileId: socket.profileId
  // });

  socket.on("joinRoom", (conversationId) => {
    socket.join(conversationId);
    console.log(
      `User with ID: ${socket.userId} joined room: ${conversationId}`
    );
  });

  socket.on("sendMessage", (data) => {
    socket.to(data.room).emit("receiveMessage", data);
  });

  socket.on("logout", () => {
    socket.disconnect();
  });

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
  const session = socket.request.session;

  if (session.user) {
    socket.sessionId = session.id;
    socket.userId = session.user?._id;
    socket.profileId = socket.handshake.auth.profileId;
    return next();
  } else {
    return next(new Error("user not logged in"));
  }
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
