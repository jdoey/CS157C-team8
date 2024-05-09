import React, { useEffect, useState } from "react";
import {
  Input,
  useDisclosure,
  Flex,
  Text,
  IconButton,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaRegHeart, FaPaperPlane, FaX } from "react-icons/fa6";

import Layout from "../Components/Layout";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Components/CustomCarousel.css";
import axiosInstance from "../axiosInstance";
import styles from "./HomePage.module.css";
import axios from "axios";
import socket from "../socket";

const images = ["pip.jpg", "piper.jpg", "pip.jpg"];

export default function HomePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profiles, setProfiles] = useState(null);
  const [index, setIndex] = useState(() => {
    const savedIndex = localStorage.getItem("index");
    return savedIndex ? JSON.parse(savedIndex) : 0;
  });
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axiosInstance.get("/user/getNearbyProfiles");
        console.log(response.data);
        setProfiles(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("index", JSON.stringify(index));
  }, [index]);

  const handleNext = () => {
    if (profiles && index < profiles.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  };

  if (!profiles) {
    return (
      <Layout>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          margin="auto"
        >
          <Text>Sorry! There's no profile available now :(</Text>
        </Flex>
      </Layout>
    );
  }

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

  const createConversation = async () => {
    try {
      const response = await axiosInstance.post(
        `http://localhost:3001/chat/conversations`,
        {
          user: profiles[index]._id,
        }
      );
      console.log(response.data);
      // return response.data;

      sendMessage({
        sender: response.data.loggedInUserProfile._id,
        receiver: profiles[index]._id,
        content: inputValue,
        conversation: response.data.conversation._id,
      });
      setInputValue("");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue === "") return;
    console.log("sending message...");
    console.log(inputValue);
    console.log(profiles[index]._id);
    createConversation();
    // const responseData = createConversation(profiles[index]._id);
    // sendMessage({
    //   sender: responseData.loggedInUserProfile._id,
    //   receiver: profiles[index]._id,
    //   content: inputValue,
    //   conversation: responseData.conversation._id,
    // });
    // setInputValue("");
    // onClose();
  };

  return (
    <Layout>
      <Flex className={styles.container}>
        <Flex className={styles.infoContainer}>
          <Profile profile={profiles[index]} />
        </Flex>
        <Flex gap="12px">
          <IconButton
            colorScheme="red"
            icon={<FaX />}
            size="lg"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            onClick={handleNext}
          />

          <IconButton
            size="lg"
            icon={<FaPaperPlane />}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            // TODO: add onClick to message user
            onClick={onOpen}
          />
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Send a message</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  placeholder="Message..."
                  size="md"
                  borderRadius="3xl"
                  value={inputValue}
                  // onKeyDown={handleEnterKey}
                  onChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant="ghost">Secondary Action</Button> */}
                <Button variant="solid" onClick={handleSendMessage}>
                  Send
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Flex>
    </Layout>
  );
}

function SimpleSlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (!images || images.length === 0) {
    return <Skeleton height="350px" fadeDuration={2} speed={2} />;
  }
  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <img className={styles.carouselImg} src={image} alt="dog" />
        ))}
      </Slider>
    </div>
  );
}

function Box({ name, title, description }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex className={styles.box}>
      <Text className={styles.title}>{title}</Text>
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Text className={styles.description}>{description}</Text>
        <IconButton
          icon={<FaRegHeart />}
          variant="ghost"
          className={styles.heartButton}
          onClick={onOpen}
        />
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex className={styles.box2}>
                <Text className={styles.title}>{title}</Text>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Text className={styles.description}>{description}</Text>
                </Flex>
              </Flex>
              <Input
                placeholder="Comment..."
                size="md"
                borderRadius="3xl"
                // value={inputValue}
                // onKeyDown={handleEnterKey}
                // onChange={handleChange}
              />
            </ModalBody>
            <ModalFooter>
              {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button> */}
              <Button variant="solid">Send Like</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
}

function Profile({ profile }) {
  function calculateAge(birthDateString) {
    const birthDate = new Date(birthDateString);
    const currentDate = new Date();
    const ageDiff = currentDate.getFullYear() - birthDate.getFullYear();

    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      return ageDiff - 1;
    } else {
      return ageDiff;
    }
  }

  const age = calculateAge(profile?.birthday);
  return (
    <>
      <Tabs
        isFitted
        variant="soft-rounded"
        colorScheme="blackAlpha"
        width="80%"
      >
        <TabList mb="1em">
          {profile.dogs.map((dog, index) => (
            <Tab key={index}>Dog {index + 1}</Tab>
          ))}
          <Tab>Owner</Tab>
        </TabList>
        <TabPanels>
          {profile.dogs.map((dog, index) => (
            <TabPanel key={index}>
              <SimpleSlider />
              <Flex className={styles.profile}>
                <Text className={styles.nameText}>{dog.name}</Text>
                <Flex gap="4px" marginBottom="8px">
                  <Text className={styles.locationText}>{profile.city},</Text>
                  <Text className={styles.locationText}>{profile.state}</Text>
                </Flex>
                <Box
                  name={dog.name}
                  title="Gender & Age"
                  description={`${dog.gender}, ${dog.age} years`}
                />
                <Box name={dog.name} title="Breed" description={dog.breed} />
                {dog.dogPrompts.map((prompt, index) => (
                  <Box
                    key={index}
                    name={dog.name}
                    title={prompt.prompt}
                    description={prompt.answer}
                  />
                ))}
              </Flex>
            </TabPanel>
          ))}
          <TabPanel>
            <SimpleSlider />
            <Flex className={styles.profile}>
              <Text className={styles.nameText}>{profile.ownerName}</Text>
              <Text className={styles.locationText}>
                {profile.city}, {profile.state}
              </Text>
              <Box
                name={profile.ownerName}
                title="Age"
                description={`${age} years`}
              />
              {profile.ownerPrompts.map((prompt, index) => (
                <Box
                  key={index}
                  name={profile.ownerName}
                  title={prompt.prompt}
                  description={prompt.answer}
                />
              ))}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
