import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogInPage from "./Pages/LogInPage";
import CreateProfile from "./Pages/CreateProfile";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/createProfile" element={<CreateProfile />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
