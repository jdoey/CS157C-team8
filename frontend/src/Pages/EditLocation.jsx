import React, { useEffect, useRef, useState } from "react";
import { Flex, Text, Button } from "@chakra-ui/react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import { Formik, Form, Field, useField } from "formik";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../Components/Layout";
import axiosInstance from "../axiosInstance";

export default function EditLocation() {
  const [value, setValue] = useState({ lat: 39.8097343, lng: -98.5556199 });

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await axiosInstance.get("/user/getUserLoc");
        const coords = response.data.coordinates;
        setValue({ lat: coords[1], lng: coords[0] });
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, []);

  const handleMarkerDragEnd = (event) => {
    const newPos = event.target.getLatLng();
    setValue(newPos);
    console.log("New position:", newPos);
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.post("/user/updateLocation", {
        coordinates: [value.lng, value.lat],
      });
      if (response.status === 200) {
        console.log("User info updated!");
        toast.success("Account updated successfully!");
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  if (!value) {
    return <div>Loading...</div>;
  }

  return (
    <Flex>
      <Layout>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Flex flexDirection="column" alignItems="center" marginTop="32px">
          <Text fontSize="24px" fontWeight="bold">
            Edit Location
          </Text>
          <Text
            fontSize="16px"
            paddingBottom="16px"
            fontStyle="italic"
            fontWeight="200"
          >
            Drag the marker to your location and click Save
          </Text>

          <MapContainer
            // center={{ lat: 39.8097343, lng: -98.5556199 }}
            center={value}
            zoom={4}
            id="editmap"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={value}
              draggable={true}
              eventHandlers={{
                dragend: handleMarkerDragEnd,
              }}
            >
              <Popup>Your location</Popup>
            </Marker>
          </MapContainer>
        </Flex>
        <Button
          colorScheme="green"
          width="80vw"
          alignSelf="center"
          marginTop="32px"
          onClick={handleSave}
        >
          Save
        </Button>
      </Layout>
    </Flex>
  );
}
