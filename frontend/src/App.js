import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInPage from "./Pages/LogInPage";
import CreateProfile from "./Pages/CreateProfile";
import HomePage from "./Pages/HomePage";
import MessagesPage from "./Pages/MessagesPage";
import ProfilePage from "./Pages/ProfilePage";
import EditProfile from "./Pages/EditProfile";

function App() {
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
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
