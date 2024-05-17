import "./App.css";
import { useEffect } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInPage from "./Pages/LogInPage";
import CreateProfile from "./Pages/CreateProfile";
import HomePage from "./Pages/HomePage";
import MessagesPage from "./Pages/MessagesPage";
import ProfilePage from "./Pages/ProfilePage";
import EditProfile from "./Pages/EditProfile";
import EditLocation from "./Pages/EditLocation";
import DogFriendlyPlaces from "./Pages/DogFriendlyPlaces";
import UserProfile from "./Pages/UserProfile";
import socket from "../src/socket";
import axiosInstance from "../src/axiosInstance";
import FilterPage from "./Pages/FilterPage";

function App() {
  // socket.on("session", ({ sessionId, userId, profileId }) => {
  //   // attach the session ID to the next reconnection attempts
  //   socket.auth = { sessionId };
  //   // store it in the localStorage
  //   localStorage.setItem("sessionId", sessionId);
  //   // save the ID of the user
  //   socket.userId = userId;
  //   socket.profileId = profileId;
  // });

  // const sessionId = localStorage.getItem("sessionId");

  // if (sessionId) {
  //   socket.auth = { sessionId };
  //   socket.connect();
  // }

  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/createProfile" element={<CreateProfile />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/editLocation" element={<EditLocation />} />
          <Route path="/filter" element={<FilterPage />} />
          <Route path="/dogfriendlyplaces" element={<DogFriendlyPlaces />} />
          <Route path="/profile/:profileId" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
