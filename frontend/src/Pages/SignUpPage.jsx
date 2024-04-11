import React, { useState } from "react";
import * as Yup from "yup";
import {
  Flex,
  Text,
  IconButton,
  Button,
  Step,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
} from "@chakra-ui/react";

import { Formik, Form, Field } from "formik";
import { IoArrowBack } from "react-icons/io5";

import Input from "../Components/Input";
import Select from "../Components/Select";
import styles from "./SignUpPage.module.css";

const steps = [
  { title: "First" },
  { title: "Second" },
  { title: "Third" },
  { title: "Fourth" },
  { title: "Fifth" },
  { title: "Sixth" },
];

export default function SignUpPage() {
  const initialValues = {
    email: "",
    password: "",
    ownerPrompt1: "",
    ownerAns1: "",
    ownerPrompt2: "",
    ownerAns2: "",
    ownerPrompt3: "",
    ownerAns3: "",
    dogPrompt1: "",
    dogAns1: "",
    dogPrompt2: "",
    dogAns2: "",
    dogPrompt3: "",
    dogAns3: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .required("Required")
      .min(8, "Too short! Minimum length should be 8 characters"),
  });

  const handleSubmit = async (values) => {
    const ownerprompts = [
      { prompt: values.ownerPrompt1, answer: values.ownerAns1 },
      { prompt: values.ownerPrompt2, answer: values.ownerAns2 },
      { prompt: values.ownerPrompt3, answer: values.ownerAns3 },
    ];
    const dogprompts = [
      { prompt: values.dogPrompt1, answer: values.dogAns1 },
      { prompt: values.dogPrompt2, answer: values.dogAns2 },
      { prompt: values.dogPrompt3, answer: values.dogAns3 },
    ];
    console.log(values);
  };

  const handleBackClick = () => {
    window.location.href = "/";
  };

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 />;
      case 4:
        return <Step5 />;
      case 5:
        return <Step6 />;
      default:
        return <div>Unknown Step</div>;
    }
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
        <Stepper colorScheme="blackAlpha" index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus complete={`✅`} incomplete={`❗️`} active={`❗️`} />
              </StepIndicator>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        <Flex className={styles.stepContainer}>
          <Flex className={styles.emailInputContainer}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form>
                {renderStepContent(activeStep)}
                <Flex className={styles.stepperButton}>
                  {!isFirstStep && <Button onClick={handleBack}>Back</Button>}
                  {!isLastStep && (
                    <Button
                      onClick={handleNext}
                      className={styles.nextButton}
                      colorScheme="green"
                    >
                      Next
                    </Button>
                  )}

                  {isLastStep && (
                    <Button
                      //   onClick={handleNext}
                      className={styles.nextButton}
                      colorScheme="green"
                      type="submit"
                    >
                      Done ✅
                    </Button>
                  )}
                </Flex>
              </Form>
            </Formik>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

function Step1() {
  return (
    <>
      <Text className={styles.headerText}>Create Account</Text>
      <Input name="firstName" type="text" label="First Name" required />
      <Input name="lastName" type="text" label="Last Name" required />
      <Input
        name="email"
        type="email"
        label="Email Address"
        placeholder="johndoe@gmail.com"
      />
      <Input name="password" type="password" label="Password" />
    </>
  );
}

function Step2() {
  return (
    <>
      <Text className={styles.headerText}>About You</Text>
      <Text className={styles.inputText}>Gender</Text>
      <Flex gap="8px">
        <Field type="radio" name="gender" value="Female" />
        Female
        <Field type="radio" name="gender" value="Male" />
        Male
        <Field type="radio" name="gender" value="Other" />
        Other
      </Flex>
      <Text className={styles.inputText} paddingTop="16px">
        Date of Birth 🎂
      </Text>
      <Input name="birthday" type="date" label="" required />
      <Text className={styles.inputText}>Where Do You Live?</Text>
      <Text fontSize="10px" fontStyle="italic">
        Enter Your Zip Code
      </Text>
      <Input name="zipcode" type="number" label="" />
    </>
  );
}

const ownerPrompts = [
  {
    id: 0,
    label: "I'm looking for a playdate buddy who...",
    value: "I'm looking for a playdate buddy who...",
  },
  {
    id: 1,
    label: "One thing my dog and I can't live without is...",
    value: "One thing my dog and I can't live without is...",
  },
  {
    id: 2,
    label: "The funniest thing my dog has ever done is...",
    value: "The funniest thing my dog has ever done is...",
  },
];

function Step3() {
  return (
    <>
      <Text className={styles.headerText}>Prompts For You</Text>
      <Select name="ownerPrompt1" options={ownerPrompts} />
      <Input name="ownerAns1" type="text" label="" />
      <Select name="ownerPrompt2" options={ownerPrompts} />
      <Input name="ownerAns2" type="text" label="" />
      <Select name="ownerPrompt3" options={ownerPrompts} />
      <Input name="ownerAns3" type="text" label="" />
    </>
  );
}

function Step4() {
  return (
    <>
      <Text className={styles.headerText}>About Fur Friend 🐶</Text>
      <Input name="petName" type="text" label="Pet Name" required />
      <Input name="petBreed" type="text" label="Breed" required />
      <Input name="petAge" type="number" label="Age" required />
      <Text className={styles.inputText}>Gender</Text>
      <Flex gap="8px">
        <Field type="radio" name="petGender" value="Female" />
        Female
        <Field type="radio" name="petGender" value="Male" />
        Male
      </Flex>
    </>
  );
}

const dogPrompts = [
  {
    id: 0,
    label: "My favorite toy to play with is...",
    value: "My favorite toy to play with is...",
  },
  {
    id: 1,
    label: "When I meet a new dog, I usually...",
    value: "When I meet a new dog, I usually...",
  },
  {
    id: 2,
    label: "My idea of a perfect playdate is...",
    value: "My idea of a perfect playdate is...",
  },
];

function Step5() {
  return (
    <>
      <Text className={styles.headerText}>Prompts For Fur Friend</Text>
      <Select name="dogPrompt1" options={dogPrompts} />
      <Input name="dogAns1" type="text" label="" />
      <Select name="dogPrompt2" options={dogPrompts} />
      <Input name="dogAns2" type="text" label="" />
      <Select name="dogPrompt3" options={dogPrompts} />
      <Input name="dogAns3" type="text" label="" />
    </>
  );
}

function Step6() {
  return (
    <>
      <Text className={styles.headerText}>Picture 📸</Text>
      <Text className={styles.inputText}>
        Upload photos of you and your pet!
      </Text>
      <Flex gap="16px" flexDirection="column">
        <input type="file" name="picture1" accept="image/*" label="" multiple />
        <input type="file" name="picture2" accept="image/*" label="" multiple />
        <input type="file" name="picture3" accept="image/*" label="" multiple />
      </Flex>
    </>
  );
}
