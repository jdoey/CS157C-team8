import React, { useEffect, useState } from "react";
import { Flex, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, useField } from "formik";
import toast, { Toaster } from "react-hot-toast";
import Input from "../Components/Input";
import FileInput from "../Components/FileInput";
import Select from "../Components/Select";
import styles from "./EditProfile.module.css";
import Layout from "../Components/Layout";
import axiosInstance from "../axiosInstance";

export default function EditProfile() {
  const [profile, setProfile] = useState(null);

  async function fetchData() {
    try {
      let response = await axiosInstance.get("/user/getProfile");
      setProfile(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const formattedBirthday = profile.birthday.split("T")[0];

  const initialValues = {
    photo0id: profile.photos[0] || "",
    photo1id: profile.photos[1] || "",
    photo2id: profile.photos[2] || "",
    photo0: null,
    photo1: null,
    photo2: null,
    ownerName: profile.ownerName || "",
    gender: profile.gender || "",
    birthday: formattedBirthday || "",
    city: profile.city || "",
    state: profile.state || "",
    ownerPrompt0: profile.ownerPrompts[0].prompt || "",
    ownerPrompt1: profile.ownerPrompts[1].prompt || "",
    ownerPrompt2: profile.ownerPrompts[2].prompt || "",
    ownerAns0: profile.ownerPrompts[0].answer || "",
    ownerAns1: profile.ownerPrompts[1].answer || "",
    ownerAns2: profile.ownerPrompts[2].answer || "",
    dogName0: profile.dogs[0].name || "",
    dogBreed0: profile.dogs[0].breed || "",
    dogAge0: profile.dogs[0].age || "",
    dog0Prompt0: profile.dogs[0].dogPrompts[0].prompt || "",
    dog0Prompt1: profile.dogs[0].dogPrompts[1].prompt || "",
    dog0Prompt2: profile.dogs[0].dogPrompts[2].prompt || "",
    dog0Ans0: profile.dogs[0].dogPrompts[0].answer || "",
    dog0Ans1: profile.dogs[0].dogPrompts[1].answer || "",
    dog0Ans2: profile.dogs[0].dogPrompts[2].answer || "",
  };

  const handleSave = async (values) => {
    try {
      const loadingToast = toast.loading("Saving...");

      const data = new FormData();
      if (values.photo0) data.append("photos", values.photo0);
      if (values.photo1) data.append("photos", values.photo1);
      if (values.photo2) data.append("photos", values.photo2);

      let response = await axiosInstance.post("/user/uploadPhotos", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        console.log("Photos uploaded!");
      } else {
        toast.error(response.data);
      }

      response = await axiosInstance.post("/user/updateUser", {
        photos: response.data.ids,
        ownerName: values.ownerName,
        gender: values.gender,
        birthday: values.birthday,
        city: values.city,
        state: values.state,
        ownerPrompts: [
          { prompt: values.ownerPrompt0, answer: values.ownerAns0 },
          { prompt: values.ownerPrompt1, answer: values.ownerAns1 },
          { prompt: values.ownerPrompt2, answer: values.ownerAns2 },
        ],
        dogs: [
          {
            name: values.dogName0,
            breed: values.dogBreed0,
            age: values.dogAge0,
            dogPrompts: [
              { prompt: values.dog0Prompt0, answer: values.dog0Ans0 },
              { prompt: values.dog0Prompt1, answer: values.dog0Ans1 },
              { prompt: values.dog0Prompt2, answer: values.dog0Ans2 },
            ],
          },
        ],
      });
      console.log(response);
      if (response.status === 200) {
        console.log("User info updated!");
        toast.success("Account updated successfully!");
        toast.dismiss(loadingToast);
        fetchData();
      } else {
        toast.error(response.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update account!");
    }
  };

  return (
    <Layout>
      <Flex className={styles.container}>
        <Toaster position="top-center" reverseOrder={false} />
        <Text className={styles.header}>Profile</Text>
        <Flex className={styles.infoContainer}>
          <Formik initialValues={initialValues} onSubmit={handleSave}>
            <Form>
              <Text className={styles.subheader}>Photos</Text>
              <Flex flexDirection="column" gap="16px">
                <FileInput name="photo0" />
                {profile.photos[0] ? (
                  <img
                    src={`http://localhost:3001/user/getPhotos/${profile.photos[0]}`}
                    style={{ height: "30%", width: "40%" }}
                  />
                ) : (
                  <p>No image set</p>
                )}
                <FileInput name="photo1" />
                {profile.photos[1] ? (
                  <img
                    src={`http://localhost:3001/user/getPhotos/${profile.photos[1]}`}
                    style={{ height: "30%", width: "40%" }}
                  />
                ) : (
                  <p>No image set</p>
                )}
                <FileInput name="photo2" />
                {profile.photos[2] ? (
                  <img
                    src={`http://localhost:3001/user/getPhotos/${profile.photos[2]}`}
                    style={{ height: "30%", width: "40%" }}
                  />
                ) : (
                  <p>No image set</p>
                )}
              </Flex>

              <Text className={styles.subheader}>Owner Information</Text>
              <Input name="ownerName" type="text" label="Name" required />

              {/* Gender  */}
              <Flex gap="8px" marginBottom="12px">
                <Field type="radio" name="gender" value="Female" />
                Female
                <Field type="radio" name="gender" value="Male" />
                Male
                <Field type="radio" name="gender" value="Other" />
                Other
              </Flex>

              <Input name="birthday" type="date" label="Birthday" required />
              <Flex width="100%" gap="48px">
                <Input name="city" type="text" label="City" required />
                <Input name="state" type="text" label="State" required />
              </Flex>

              {/* Owner Prompts  */}
              <Text className={styles.headerText}>Owner Prompts</Text>
              {profile.ownerPrompts.map((prompt, index) => (
                <div key={index}>
                  <Select
                    name={`ownerPrompt${index}`}
                    options={ownerPrompts}
                    placeholder={prompt.prompt}
                  />
                  <Input name={`ownerAns${index}`} type="text" label="" />
                </div>
              ))}

              {/* Location  */}
              <Text className={styles.headerText} fontWeight="600">
                Location
              </Text>
              <Text className={styles.subheader} marginTop="0">
                Click here to edit your location
              </Text>
              <Link to="/editLocation">
                <Button>Location</Button>
              </Link>

              {/* Dogs Information  */}
              <Text className={styles.subheader} marginTop="36px">
                Dogs Information
              </Text>
              {profile.dogs.map((dog, index) => (
                <>
                  <Text className={styles.subheader} marginTop="4px">
                    Dog
                  </Text>
                  <Input
                    name={`dogName${index}`}
                    type="text"
                    label="Name"
                    required
                  />
                  <Input
                    name={`dogBreed${index}`}
                    type="text"
                    label="Breed"
                    required
                  />
                  <Input
                    name={`dogAge${index}`}
                    type="number"
                    label="Age"
                    required
                  />

                  {/* Dogs Prompts  */}
                  {dog.dogPrompts.map((prompt, pidx) => (
                    <div key={pidx}>
                      <Select
                        name={`dog${index}Prompt${pidx}`}
                        options={dogPrompts}
                        placeholder={prompt.prompt}
                      />
                      <Input
                        name={`dog${index}Ans${pidx}`}
                        type="text"
                        label=""
                      />
                    </div>
                  ))}
                </>
              ))}

              <Flex gap="16px" justifyContent="flex-end">
                {/* <Button>Cancel</Button> */}
                <Button colorScheme="green" type="submit">
                  Save
                </Button>
              </Flex>
            </Form>
          </Formik>
        </Flex>
      </Flex>
    </Layout>
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
