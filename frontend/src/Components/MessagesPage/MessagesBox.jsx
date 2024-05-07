import { React, useState, useEffect, useRef } from "react";
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
  Input,
} from "@chakra-ui/react";
import axios from "axios";

const MessagesBox = ({
  conversationId,
  selected,
  profile,
  messageHistory,
  options,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const sendMessage = async (messageData) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/chat/messages/send`,
        messageData
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    console.log("sending message...");
    console.log(inputValue);
    sendMessage({
      sender: profile._id,
      receiver: selected._id,
      content: inputValue,
      conversation: conversationId,
    });
    setInputValue("");
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageHistory]);

  return (
    <Box width={["100%", "58vw"]} pr={0}>
      <Card height={"100%"}>
        <Stack height={"90%"}>
          <Card>
            <CardHeader>
              <Stack direction="row" alignItems="center">
                <Avatar size={"md"} name={selected.ownerName} />
                <Stack pl={"20px"}>
                  <Heading size="md">{selected.ownerName}</Heading>
                </Stack>
              </Stack>
            </CardHeader>
          </Card>
          <Box height={"100%"} pb={"20px"} overflowY={"auto"}>
            {messageHistory.map((message, i) =>
              profile._id !== message.sender._id ? (
                <Box pl={6} pt={1} key={message._id}>
                  <Stack columnGap={3} maxWidth={"45%"}>
                    <Stack direction="row" alignItems="center" gap={"15px"}>
                      {i > 0 &&
                      messageHistory[i - 1].sender._id ===
                        message.sender._id ? (
                        <Avatar
                          size={"sm"}
                          visibility={"hidden"}
                          name={message.sender.ownerName}
                        />
                      ) : (
                        <Avatar size={"sm"} name={message.sender.ownerName} />
                      )}
                      <Card borderRadius="3xl" bg={"gray.100"}>
                        <CardBody p={3} pt={2} pb={2}>
                          <Text fontSize={"sm"}>{message.content}</Text>
                        </CardBody>
                      </Card>
                    </Stack>
                    {/* <Stack direction="row" alignItems="center" gap={"15px"}>
                      <Avatar
                        visibility="hidden"
                        size={"sm"}
                        name={"Jonathan"}
                      />
                      <Card borderRadius="3xl" bg={"gray.100"}>
                        <CardBody p={3} pt={2} pb={2}>
                          <Text fontSize={"sm"}>
                            hello its me yoooo hsfdsdf sdfsdfsf sdf sdfsd fsd
                            fsddd asdasdfas asdasd
                          </Text>
                        </CardBody>
                      </Card>
                    </Stack> */}
                  </Stack>
                </Box>
              ) : (
                <Box
                  pr={6}
                  pt={1}
                  key={message._id}
                  display="flex"
                  justifyContent="end"
                >
                  <Stack columnGap={3} maxWidth={"45%"}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={"15px"}
                      justifyContent="end"
                    >
                      <Card borderRadius="3xl" bg={"blue.400"} color={"white"}>
                        <CardBody p={3} pt={2} pb={2}>
                          <Text fontSize={"sm"}>{message.content}</Text>
                        </CardBody>
                      </Card>
                    </Stack>
                    {/* <Stack
                      direction="row"
                      alignItems="center"
                      gap={"15px"}
                      justifyContent="end"
                    >
                      <Card borderRadius="3xl" bg={"blue.400"} color={"white"}>
                        <CardBody p={3} pt={2} pb={2}>
                          <Text fontSize={"sm"}>hello its me yoooo</Text>
                        </CardBody>
                      </Card>
                    </Stack> */}
                  </Stack>
                </Box>
              )
            )}
            <div ref={messagesEndRef} />
          </Box>
        </Stack>
        <Card>
          <CardBody pb={"15px"}>
            <Input
              placeholder="Message..."
              size="lg"
              borderRadius="3xl"
              value={inputValue}
              onKeyDown={handleEnterKey}
              onChange={handleChange}
            />
          </CardBody>
        </Card>
      </Card>
    </Box>
  );
};

export default MessagesBox;
