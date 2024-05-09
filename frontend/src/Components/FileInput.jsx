import React, { InputHTMLAttributes } from "react";
import { Flex } from "@chakra-ui/react";
import { useField } from "formik";
import CreatableSelect from "react-select/creatable";

import styles from "./Input.module.css";

const FormikFileInput = ({ name, options, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;

  return (
    <Flex className={styles.container}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setValue(e.target.files[0])}
        {...props}
      />
    </Flex>
  );
};

export default FormikFileInput;
