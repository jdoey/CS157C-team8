// create layout component

import React from "react";
import { Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <Flex>
      <Sidebar />
      <Flex flexDirection="column">
        <Navbar />
        {children}
      </Flex>
    </Flex>
  );
}
