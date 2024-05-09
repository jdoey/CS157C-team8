import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Flex,
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import axiosInstance from "../axiosInstance";
function DogFriendlyPlaces() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");

  const fetchDogFriendlyPlaces = (latitude, longitude) => {
    axiosInstance
      .post("http://localhost:3001/Places/dog-friendly-places", {
        latitude,
        longitude,
      })
      .then((response) => {
        setPlaces(response.data);
      })
      .catch((err) => {
        setError("Failed to fetch places: " + err.message);
      });
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        fetchDogFriendlyPlaces(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        setError("Access to location was denied.");
      }
    );
  };

  return (
    <Flex direction="column" align="center" justify="center" p={4}>
      <Button onClick={handleLocation} colorScheme="blue">
        Find Dog-Friendly Places
      </Button>
      {error && <Text color="red.500">{error}</Text>}
      <Box mt={4}>
        {places.length > 0 ? (
          places.map((place, index) => (
            <Box
              key={index}
              p={4}
              shadow="md"
              borderWidth="1px"
              mb={2}
              borderRadius="lg"
            >
              <Text fontWeight="bold" fontSize="xl">
                {place.name}
              </Text>
              <Text>{place.description || "No description available"}</Text>
              <Text>{place.address}</Text>
              {place.contact && <Text>Contact: {place.contact}</Text>}
              {place.openHours && <Text>Open Hours: {place.openHours}</Text>}
              <VStack align="start">
                {place.amenities.map((amenity, aIndex) => (
                  <HStack key={aIndex}>
                    <Badge colorScheme="green">{amenity.feature}</Badge>
                    <Text>{amenity.description}</Text>
                  </HStack>
                ))}
              </VStack>
              <Box mt={2}>
                <Text fontWeight="bold">Reviews:</Text>
                {place.reviews.map((review, rIndex) => (
                  <Box key={rIndex} p={2} bg="gray.100" mt={1}>
                    <Text fontWeight="bold">{review.reviewer}</Text>
                    <Text fontSize="sm">{review.text}</Text>
                    <Text fontSize="xs">Rating: {review.rating} / 5</Text>
                  </Box>
                ))}
              </Box>
              <Box mt={2}>
                <Text fontWeight="bold">Upcoming Events:</Text>
                {place.events.map((event, eIndex) => (
                  <Text key={eIndex} fontSize="sm">
                    {event.title} - {event.date}
                  </Text>
                ))}
              </Box>
            </Box>
          ))
        ) : (
          <Text>No places found or click above to search.</Text>
        )}
      </Box>
    </Flex>
  );
}

export default DogFriendlyPlaces;
