import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { Flex, Text, IconButton, FormLabel, Button } from "@chakra-ui/react";
import { FaDog } from "react-icons/fa6";
import * as Yup from "yup";
import { Formik, Form, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Input from "../Components/Input";
import styles from "./LogInPage.module.css";
import socket from "../socket";

export default function LogInPage() {
  const initialValues = { email: "", password: "" };
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values, formikHelpers) => {
    try {
      console.log(values);
      const response = await axiosInstance.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      console.log(response.data.userId);
      // const userId = response.data.userId;
      const profileId = response.data.profileId;
      socket.auth = { profileId };
      socket.connect();
      console.log(socket);
      navigate("/home");
    } catch (error) {
      if (error.response.data.message === "Invalid Email") {
        formikHelpers.setFieldError("email", "Invalid Email");
      } else if (error.response.data.message === "Invalid Password") {
        formikHelpers.setFieldError("password", "Invalid Password");
      } else {
        toast.error("An unexpected error occured.");
      }
    }
  };

  return (
    <Flex className={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />
      <Flex className={styles.textContainer}>
        <Flex className={styles.circle}>
          <FaDog className={styles.dogIcon} />
        </Flex>
        <Text className={styles.logoText}>Connect Fur</Text>
        <Flex className={styles.emailInputContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="johndoe@gmail.com"
              />

              <Input name="password" type="password" label="Password" />
              <Button className={styles.continueButton} type="submit">
                Continue
              </Button>
            </Form>
          </Formik>

          <a>
            <Text
              className={styles.bottomText}
              _hover={{ textDecoration: "underline" }}
            >
              Forgot Password?
            </Text>
          </a>

          <a href="/createProfile">
            <Text className={styles.bottomText}>Create Account</Text>
          </a>
        </Flex>
      </Flex>
    </Flex>
  );
}
