import React from "react";
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

const MessagesList = ({ name, options, ...props }) => {
  return (
    <Box width={["100%", "450px"]}>
      <Card height={"100%"} borderWidth="1px" borderColor="gray.200">
        <CardHeader>
          <Heading size="lg">Messages</Heading>
        </CardHeader>
        <CardBody>
          <UserCard name={"Jonathan"} lastMessage={"You: hi john"} />
          <UserCard name={"Sephia"} lastMessage={"You: hi seph"} />
          <UserCard name={"Anusha"} lastMessage={"hi"} />
        </CardBody>
      </Card>
    </Box>
  );
};

export default MessagesList;
