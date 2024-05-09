import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Skeleton,
} from "@chakra-ui/react";
import { FaRegHeart, FaPaperPlane, FaX } from "react-icons/fa6";

import Layout from "../Components/Layout";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Components/CustomCarousel.css";
import axiosInstance from "../axiosInstance";
import styles from "./HomePage.module.css";

const images = ["pip.jpg", "piper.jpg", "pip.jpg"];

export default function HomePage() {
  const [profiles, setProfiles] = useState(null);
  const [index, setIndex] = useState(() => {
    const savedIndex = localStorage.getItem("index");
    return savedIndex ? JSON.parse(savedIndex) : 0;
  });

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

  console.log("nearby profiles", profiles);

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
          />
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

function Box({ title, description }) {
  return (
    <Flex className={styles.box}>
      <Text className={styles.title}>{title}</Text>
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Text className={styles.description}>{description}</Text>
        <IconButton
          icon={<FaRegHeart />}
          variant="ghost"
          className={styles.heartButton}
        />
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
                  title="Gender & Age"
                  description={`${dog.gender}, ${dog.age} years`}
                />
                <Box title="Breed" description={dog.breed} />
                {dog.dogPrompts.map((prompt, index) => (
                  <Box
                    key={index}
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
              <Box title="Age" description={`${age} years`} />
              {profile.ownerPrompts.map((prompt, index) => (
                <Box
                  key={index}
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
