import React, { useState, useEffect } from "react";
import {
  Flex,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Box,
  Heading,
  Avatar,
  AvatarBadge,
  Text,
} from "@chakra-ui/react";

import UserCard from "./UserCard";

const MessagesList = ({ name, selected, handleSelect, options, ...props }) => {
  return (
    <Box width={["100%", "450px"]}>
      <Card height={"100%"} borderWidth="1px" borderColor="gray.200">
        <CardHeader>
          <Heading size="lg">Messages</Heading>
        </CardHeader>
        <CardBody>
          <UserCard
            name={"Jonathan"}
            lastMessage={"You: hi john"}
            selected={selected}
            handleSelect={handleSelect}
          />
          <UserCard
            name={"Sephia"}
            lastMessage={"You: hi seph"}
            selected={selected}
            handleSelect={handleSelect}
          />
          <UserCard
            name={"Anusha"}
            lastMessage={"hi"}
            selected={selected}
            handleSelect={handleSelect}
          />
        </CardBody>
      </Card>
    </Box>
  );
};

export default MessagesList;
