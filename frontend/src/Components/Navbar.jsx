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

  const handleSignOut = () => {
    // TODO: implement sign out logic
    console.log("Signing out...");
    navigate("/");
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
          <MenuList>
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
