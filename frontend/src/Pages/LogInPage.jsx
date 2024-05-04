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

export default function LogInPage() {
  const initialValues = { email: "", password: "" };
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Required")
      .min(8, "Too short! Minimum length should be 8 characters"),
  });

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      const response = await axiosInstance.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      console.log(response.data);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex className={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />
      <Flex className={styles.textContainer}>
        <Flex className={styles.circle}>
          <FaDog className={styles.dogIcon} />
        </Flex>
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
