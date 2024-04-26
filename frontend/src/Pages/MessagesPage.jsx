import React from "react";
import { Flex, Text, Button, Stack } from "@chakra-ui/react";
import MessagesList from "../Components/MessagesPage/MessagesList";
import MessagesBox from "../Components/MessagesPage/MessagesBox";

export default function HomePage() {
  return (
    <Flex ml={{ base: 0, md: 60 }} p="4" pt={0} height={"100vh"}>
      <Stack direction={"row"}>
        <MessagesList />
        <MessagesBox />
      </Stack>
    </Flex>
  );
}
