import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInPage from "./Pages/LogInPage";
import CreateProfile from "./Pages/CreateProfile";
import HomePage from "./Pages/HomePage";
import MessagesPage from "./Pages/MessagesPage";
import ProfilePage from "./Pages/ProfilePage";
import EditProfile from "./Pages/EditProfile";
import EditLocation from "./Pages/EditLocation";
import socket from "./socket";
import DogFriendlyPlaces from "./Pages/DogFriendlyPlaces";

function App() {
  // socket.on("session", ({ sessionID, userID }) => {
  //   // attach the session ID to the next reconnection attempts
  //   socket.auth = { sessionID };
  //   // store it in the localStorage
  //   localStorage.setItem("sessionID", sessionID);
  //   // save the ID of the user
  //   socket.userID = userID;
  // });

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
          <Route path="/dogfriendlyplaces" element={<DogFriendlyPlaces />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
