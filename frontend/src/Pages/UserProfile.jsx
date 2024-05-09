import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Button,
  Skeleton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
} from "@chakra-ui/react";
import { FaPaperPlane, FaRegHeart, FaX } from "react-icons/fa6";
import Layout from "../Components/Layout";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Components/CustomCarousel.css";
import axiosInstance from "../axiosInstance";
import { useParams } from "react-router-dom";
import styles from "./ProfilePage.module.css";

const images = ["pip.jpg", "piper.jpg", "pip.jpg"];

function calculateAge(birthDateString) {
  const birthDate = new Date(birthDateString);
  const currentDate = new Date();
  const ageDiff = currentDate.getFullYear() - birthDate.getFullYear();

  // Adjust age based on whether birthday has occurred this year
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

export default function ProfilePage() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);

  async function fetchData() {
    try {
      let response = await axiosInstance.get(`/user/getProfile/${profileId}`);
      console.log(response.data);
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // calculate owner's age
  const age = calculateAge(profile?.birthday);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Flex className={styles.container}>
        <Flex className={styles.infoContainer}>
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
                      <Text className={styles.locationText}>
                        {profile.city},
                      </Text>
                      <Text className={styles.locationText}>
                        {profile.state}
                      </Text>
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
                {/* Owner Profile  */}
                <SimpleSlider />
                <Flex className={styles.profile}>
                  <Text className={styles.nameText}>{profile.ownerName}</Text>
                  <Flex gap="4px" marginBottom="8px">
                    <Text className={styles.locationText}>{profile.city},</Text>
                    <Text className={styles.locationText}>{profile.state}</Text>
                  </Flex>
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
          <img className={styles.carouselImg} src={`/${image}`} alt="dog" />
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
