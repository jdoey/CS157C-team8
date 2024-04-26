import React, { useState } from "react";
import { Flex, Text, Button, Stack } from "@chakra-ui/react";
import MessagesList from "../Components/MessagesPage/MessagesList";
import MessagesBox from "../Components/MessagesPage/MessagesBox";
import Layout from "../Components/Layout";

export default function HomePage() {
  const [selected, setSelected] = useState("");
  const handleSelect = (name) => {
    setSelected(name);
  };
  return (
    <Layout>
      <Flex p="4" pl={0} pt={0} height={"90vh"}>
        <Stack direction={"row"} gap={0.5}>
          <MessagesList selected={selected} handleSelect={handleSelect} />
          {selected != "" ? <MessagesBox selected={selected} /> : <Text></Text>}
        </Stack>
      </Flex>
    </Layout>
  );
}
