import { React, useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
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
import socket from "../../socket";
import axiosInstance from "../../axiosInstance";
import styles from "./MessagesBox.module.css";

const MessagesBox = ({
  conversationId,
  selected,
  profile,
  options,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);

  const getMessageHistory = async (conversationId) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:3001/chat/messages/${conversationId}`,
        {
          params: { conversationId: conversationId },
        }
      );
      setMessageHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(conversationId);
    getMessageHistory(conversationId);
  }, [selected]);

  const sendMessage = async (messageData) => {
    try {
      const response = await axiosInstance.post(
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
    if (inputValue === "") return;
    console.log("sending message...");
    console.log(inputValue);
    socket.emit("sendMessage", {
      content: inputValue,
      room: conversationId,
    });
    setMessageHistory((history) => [
      ...history,
      {
        sender: { _id: profile._id },
        receiver: profile.ownerName,
        content: inputValue,
        conversation: conversationId,
      },
    ]);
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

  useEffect(() => {
    const eventListener = (data) => {
      console.log(selected);
      console.log("local conversationId: " + conversationId);
      console.log("socket conversationId: " + data.room);
      if (data.room === conversationId) {
        setMessageHistory((history) => [
          ...history,
          {
            sender: { _id: selected._id, ownerName: selected.ownerName },
            receiver: profile.ownerName,
            content: data.content,
            conversation: data.room,
          },
        ]);
      }
    };
    socket.on("receiveMessage", eventListener);
    return () => socket.off("receiveMessage", eventListener);
  }, [conversationId]);

  // useMemo(() => {
  //   socket.on("receiveMessage", (data) => {
  //     setMessageHistory((history) => [
  //       ...history,
  //       {
  //         sender: { _id: selected._id, ownerName: selected.ownerName },
  //         receiver: profile.ownerName,
  //         content: data.content,
  //         conversation: data.room,
  //       },
  //     ]);
  //   });
  // }, [socket]);

  return (
    <Box width={["full"]} pr={0}>
      <Card height={"100%"}>
        <Stack height={"90%"}>
          <Card>
            <CardHeader>
              <Stack direction="row" alignItems="center">
                <Avatar
                  as={Link}
                  to={`/profile/${selected._id}`}
                  size={"md"}
                  name={selected.ownerName}
                />
                <Stack as={Link} to={`/profile/${selected._id}`} pl={"20px"}>
                  <Heading size="md">{selected.ownerName}</Heading>
                </Stack>
              </Stack>
            </CardHeader>
          </Card>
          <Box
            height={"100%"}
            pb={"20px"}
            overflowY={"auto"}
            // display={"flex"}
            // justifyContent={"flex-end"}
            // flexDirection={"column"}
          >
            {messageHistory?.map((message, i) =>
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
                          {message?.prompt != null ? (
                            <Flex className={styles.box2}>
                              <Text className={styles.title}>
                                {message.prompt.title}
                              </Text>
                              <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                width="100%"
                              >
                                <Text className={styles.description}>
                                  {message.prompt.description}
                                </Text>
                              </Flex>
                            </Flex>
                          ) : null}
                          <Text fontSize={"sm"}>{message.content}</Text>
                        </CardBody>
                      </Card>
                    </Stack>
                  </Stack>
                </Box>
              )
            )}
            <div ref={messagesEndRef} />
          </Box>
        </Stack>
        <Card height={"10%"}>
          <CardBody pb={3} pt={3}>
            <Input
              placeholder="Message..."
              size="md"
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
