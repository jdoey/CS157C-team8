import React from "react";
import { Flex, Box, Text, Button, IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaDog, FaRegCompass, FaRegUser, FaRegMessage } from "react-icons/fa6";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <Flex className={styles.container}>
      <Link className={styles.logoContainer} to="/home">
        <Flex className={styles.circle}>
          <FaDog className={styles.dogIcon} />
        </Flex>
        <Text className={styles.logoText}>Connect Fur</Text>
      </Link>
      <Flex className={styles.navContainer}>
        <Link to="/home">
          <Button
            className={styles.sidebarButton}
            leftIcon={<FaRegCompass />}
            variant="ghost"
            justifyContent="flex-start"
          >
            For You
          </Button>
        </Link>
        <Link to="/messages">
          <Button
            className={styles.sidebarButton}
            leftIcon={<FaRegMessage />}
            variant="ghost"
            width="100%"
            justifyContent="flex-start"
          >
            Messages
          </Button>
        </Link>
        <Link to="/profile">
          <Button
            className={styles.sidebarButton}
            leftIcon={<FaRegUser />}
            variant="ghost"
            justifyContent="flex-start"
          >
            Profile
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
}
