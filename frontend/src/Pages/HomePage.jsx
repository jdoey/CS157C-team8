import React from "react";
import {
  Flex,
  Text,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { FaRegHeart } from "react-icons/fa6";
import Layout from "../Components/Layout";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Components/CustomCarousel.css";

import styles from "./HomePage.module.css";

const images = ["pip.jpg", "piper.jpg", "pip.jpg"];

export default function HomePage() {
  return (
    <Layout>
      <Flex className={styles.container}>
        <Flex className={styles.infoContainer}>
          <Profile />
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

function Profile() {
  return (
    <>
      <Tabs
        isFitted
        variant="soft-rounded"
        colorScheme="blackAlpha"
        width="80%"
      >
        <TabList mb="1em">
          <Tab>Dog</Tab>
          <Tab>Owner</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SimpleSlider />
            <Flex className={styles.profile}>
              <Text className={styles.nameText}>Piper</Text>
              <Text className={styles.locationText}>San Jose, CA</Text>
              <Box title="Age" description="4 years" />
              <Box title="Breed" description="Golden Retriever" />
            </Flex>
          </TabPanel>
          <TabPanel>
            <SimpleSlider />
            <Flex className={styles.profile}>
              <Text className={styles.nameText}>Person</Text>
              <Text className={styles.locationText}>San Jose, CA</Text>
              <Box title="Age" description="22 years" />
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
