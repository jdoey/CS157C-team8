import React, { useState, useEffect } from "react";
import { Flex, Text, Button, Stack } from "@chakra-ui/react";
import MessagesList from "../Components/MessagesPage/MessagesList";
import MessagesBox from "../Components/MessagesPage/MessagesBox";
import Layout from "../Components/Layout";
import axios from "axios";
import axiosInstance from "../axiosInstance";

export default function HomePage() {
  const [selected, setSelected] = useState("");
  const [conversations, setConversations] = useState([]);
  const [profile, setProfile] = useState(null);

  async function fetchData() {
    try {
      let response = await axiosInstance.get("/user/getProfile");
      console.log(response.data);
      setProfile(response.data);
      getConversations(response.data._id);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelect = (name) => {
    setSelected(name);
  };

  const getConversations = async (profileId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/chat/conversations/${profileId}`,
        {
          params: { profileId: profileId },
        }
      );
      console.log(response.data);
      setConversations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   getConversations();
  // }, []);

  return (
    <Layout>
      <Flex p="4" pl={0} pt={0} height={"90vh"}>
        <Stack direction={"row"} gap={0.5}>
          <MessagesList
            selected={selected}
            handleSelect={handleSelect}
            conversations={conversations}
            profile={profile}
          />
          {selected != "" ? <MessagesBox selected={selected} /> : <Text></Text>}
        </Stack>
      </Flex>
    </Layout>
  );
}
