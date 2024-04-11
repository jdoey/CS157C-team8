import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { Flex, Text, IconButton, Button } from "@chakra-ui/react";
import { FaDog } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { Formik, Form, Field } from "formik";
import { IoArrowBack } from "react-icons/io5";

import Input from "../Components/Input";
import Select from "../Components/Select";
import styles from "./SignUpPage.module.css";

export default function SignUpPage() {
  const initialValues = {
    email: "",
    password: "",
    // firstName: "",
    // lastName: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Required")
      .min(8, "Too short! Minimum length should be 8 characters"),
    // firstName: Yup.string().required("Required"),
    // lastName: Yup.string().required("Required"),
  });

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      console.log(values);
      const response = await axios.post("http://localhost:3001/auth/signup", {
        email: values.email,
        password: values.password,
      });

      console.log(response.data);
      navigate("/createProfile");
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackClick = () => {
    window.location.href = "/";
  };

  return (
    <Flex className={styles.container}>
      <IconButton
        icon={<IoArrowBack />}
        aria-label="Back"
        variant="unstyled"
        onClick={handleBackClick}
        fontSize="24px"
      />
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
              <Text className={styles.headerText}>Create Account</Text>
              {/* <Input
                  name="firstName"
                  type="text"
                  label="First Name"
                  required
                />
                <Input name="lastName" type="text" label="Last Name" required /> */}
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
        </Flex>
      </Flex>
    </Flex>
  );
}
