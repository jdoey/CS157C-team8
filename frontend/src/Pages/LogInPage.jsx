import React, { useState } from "react";
import { Flex, Text, IconButton, FormLabel, Button } from "@chakra-ui/react";

import { FaDog } from "react-icons/fa6";
import * as Yup from "yup";
import { Formik, Form, FormikHelpers } from "formik";
import Input from "../Components/Input";
import styles from "./LogInPage.module.css";

export default function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Required")
      .min(8, "Too short! Minimum length should be 8 characters"),
  });

  const handleSubmit = async (values) => {
    console.log(values);
  };

  return (
    <Flex className={styles.container}>
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

          <a href="/signUp">
            <Text className={styles.bottomText}>Create Account</Text>
          </a>
        </Flex>
      </Flex>
    </Flex>
  );
}
