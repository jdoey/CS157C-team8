import React, { useState, useEffect } from "react";
import {
  Flex,
  Badge,
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
import socket from "../../socket";

const MessagesList = ({
  selected,
  handleSelect,
  conversations,
  profile,
  options,
  ...props
}) => {
  useEffect(() => {
    socket.on("users", (users) => {
      console.log(users);
      users.forEach((user) => {
        console.log(user);
      });
    });
  }, []);

  return (
    <Box width={["100%", "450px"]}>
      <Card height={"100%"} borderWidth="1px" borderColor="gray.200">
        <CardHeader>
          <Heading size="lg">Messages</Heading>
        </CardHeader>
        <CardBody>
          {conversations?.map((conversation) =>
            conversation?.users.map((user) =>
              profile._id !== user._id ? (
                <UserCard
                  key={conversation._id}
                  conversationId={conversation._id}
                  name={user.ownerName}
                  targetUser={user}
                  lastMessage={conversation.latestMessage}
                  selected={selected}
                  handleSelect={handleSelect}
                />
              ) : null
            )
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default MessagesList;
