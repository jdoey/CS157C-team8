import React, { InputHTMLAttributes } from "react";
import { Flex } from "@chakra-ui/react";
import { useField } from "formik";
import CreatableSelect from "react-select/creatable";

import styles from "./Input.module.css";

const FormikSelect = ({ name, options, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;

  return (
    <Flex className={styles.container}>
      <CreatableSelect
        options={options}
        value={options ? options.find((o) => o.value === field.value) : ""}
        onChange={(option) => {
          setValue(option.value);
        }}
        {...props}
      />
    </Flex>
  );
};

export default FormikSelect;
