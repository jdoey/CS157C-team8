import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Text,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Avatar,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FaDog, FaRegCompass, FaRegUser, FaRegMessage } from "react-icons/fa6";
import { ChevronDownIcon } from "@chakra-ui/icons";
import styles from "./Navbar.module.css";
import axiosInstance from "../axiosInstance";

export default function Navbar() {
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    console.log("Signing out...");
    try {
      let response = await axiosInstance.post("/auth/logout");
      if (response.status === 200) {
        console.log("Signed out successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axiosInstance.get("/user/getProfile");
        console.log(response.data);
        setProfile(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Flex className={styles.container}>
      <Flex gap="8px" alignItems="center">
        <Avatar size="sm" />
        {/* TODO: get name from db */}
        <Text className={styles.nameText}>{profile.ownerName}</Text>
        <Menu>
          <MenuButton
            transition="all 0.2s"
            as={IconButton}
            icon={<ChevronDownIcon />}
            variant="ghost"
          />
          <MenuList zIndex="1000">
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}
