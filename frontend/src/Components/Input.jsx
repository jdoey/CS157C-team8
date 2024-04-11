import React, { InputHTMLAttributes } from "react";
import { Input, Flex, FormLabel } from "@chakra-ui/react";
import { useField } from "formik";

import styles from "./Input.module.css";

const FormikInput = ({ name, label, ...props }) => {
  const [field, meta] = useField(name);
  const { touched, error } = meta;

  return (
    <Flex className={styles.container}>
      <FormLabel className={styles.formText}>{label}</FormLabel>
      <Input fontSize="16px" {...field} {...props} />
      <Flex className={styles.error}>{touched && error ? error : ""}</Flex>
    </Flex>
  );
};

export default FormikInput;
