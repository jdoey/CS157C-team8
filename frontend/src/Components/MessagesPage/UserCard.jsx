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
  Badge,
  Text,
} from "@chakra-ui/react";

const UserCard = ({
  conversationId,
  name,
  targetUser,
  lastMessage,
  selected,
  handleSelect,
  options,
  ...props
}) => {
  return (
    <Card
      id={conversationId}
      onClick={() => handleSelect(conversationId, targetUser)}
      _hover={{
        boxShadow: "lg",
        bg: "gray.100",
      }}
      bg={selected._id === targetUser._id ? "gray.200" : "white"}
    >
      <CardHeader>
        <Stack direction="row">
          <Avatar size={"md"} name={name} />
          <Stack pl={"20px"} pt={1} gap={0.5}>
            <Heading size="sm">{name}</Heading>
            {lastMessage?.sender === targetUser._id ? (
              <Text fontSize={"xs"}>{lastMessage?.content}</Text>
            ) : (
              <Text fontSize={"xs"}>You: {lastMessage?.content}</Text>
            )}
          </Stack>
        </Stack>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
