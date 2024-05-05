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

const UserCard = ({
  name,
  lastMessage,
  selected,
  handleSelect,
  options,
  ...props
}) => {
  return (
    <Card
      id={name}
      onClick={() => handleSelect(name)}
      _hover={{
        boxShadow: "lg",
        bg: "gray.100",
      }}
      bg={selected === name ? "gray.200" : "white"}
    >
      <CardHeader>
        <Stack direction="row">
          <Avatar size={"md"} name={name} />
          <Stack pl={"20px"} pt={1} gap={0.5}>
            <Heading size="sm">{name}</Heading>
            <Text fontSize={"xs"}>{lastMessage}</Text>
          </Stack>
        </Stack>
      </CardHeader>
    </Card>
  );
};

export default UserCard;