import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  useEditable,
} from "@chakra-ui/react";
import axiosInstance from "../axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../Components/Layout";
import styles from "./FilterPage.module.css";

export default function FilterPage() {
  const [distance, setDistance] = useState(20);

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "14px",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axiosInstance.get("/user/getPreferences");
        console.log(response.data);
        if (response.status === 200) {
          setDistance(response.data.distance);
        } else {
          toast.error("Failed to load preferences");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load preferences");
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const loadingToast = toast.loading("Saving...");

      console.log("Distance:", distance);
      let response = await axiosInstance.post("/user/setPreferences", {
        distance: distance,
      });
      console.log(response);
      if (response.status === 200) {
        console.log("Preferences updated");
        toast.success("Preferences updated");
        toast.dismiss(loadingToast);
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update preferences");
    }
  };

  return (
    <Layout>
      <Flex className={styles.container}>
        <Toaster position="top-center" reverseOrder={false} />
        <Text className={styles.header}>Filter & Preferences</Text>
        <Text className={styles.subheader}>
          filters profiles you want to see
        </Text>

        <Flex className={styles.filterContainer}>
          <Text className={styles.fieldText}>Distances</Text>
          <Text className={styles.subheader} paddingBottom="16px">
            Set the maximum distance from your location
          </Text>
          <Slider
            colorScheme="gray"
            marginTop="5vh"
            value={distance}
            min={5}
            max={3000}
            onChange={(val) => setDistance(val)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
            <SliderMark value={5} {...labelStyles}>
              5 Miles
            </SliderMark>
            <SliderMark value={3000} {...labelStyles}>
              3000 Miles
            </SliderMark>
            <SliderMark
              value={distance}
              textAlign="center"
              fontWeight={600}
              width="10vw"
              mt="-5vh"
              ml="-5vw"
            >
              {distance} miles
            </SliderMark>
          </Slider>
        </Flex>

        <Flex paddingTop="64px" justifyContent="flex-end">
          <Button colorScheme="green" onClick={handleSave}>
            Save
          </Button>
        </Flex>
      </Flex>
    </Layout>
  );
}
