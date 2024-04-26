import React from "react";
import {
  Flex,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Box,
  Heading,
  Avatar,
  AvatarBadge,
  Text,
  Input,
} from "@chakra-ui/react";

const MessagesBox = ({ name, selected, options, ...props }) => {
  return (
    <Box width={["100%", "58vw"]} pr={0}>
      <Card height={"100%"}>
        <Stack height={"95%"}>
          <Card>
            <CardHeader>
              <Stack direction="row" alignItems="center">
                <Avatar size={"md"} name={selected} />
                <Stack pl={"20px"}>
                  <Heading size="md">{selected}</Heading>
                </Stack>
              </Stack>
            </CardHeader>
          </Card>
          <Box
            height={"100%"}
            display={"flex"}
            justifyContent={"flex-end"}
            flexDirection={"column"}
            pb={"20px"}
            overflowY={"auto"}
          >
            <Box pl={6} pt={4}>
              <Stack columnGap={3} maxWidth={"45%"}>
                <Stack direction="row" alignItems="center" gap={"15px"}>
                  <Avatar size={"sm"} name={selected} />
                  <Card borderRadius="3xl" bg={"gray.100"}>
                    <CardBody p={3} pt={2} pb={2}>
                      <Text fontSize={"sm"}>
                        hello its me yoooo hsfdsdf sdfsdfsf sdf sdfsd fsd fsddd
                        asdasdfas asdasd
                      </Text>
                    </CardBody>
                  </Card>
                </Stack>
                <Stack direction="row" alignItems="center" gap={"15px"}>
                  <Avatar visibility="hidden" size={"sm"} name={"Jonathan"} />
                  <Card borderRadius="3xl" bg={"gray.100"}>
                    <CardBody p={3} pt={2} pb={2}>
                      <Text fontSize={"sm"}>
                        hello its me yoooo hsfdsdf sdfsdfsf sdf sdfsd fsd fsddd
                        asdasdfas asdasd
                      </Text>
                    </CardBody>
                  </Card>
                </Stack>
              </Stack>
            </Box>
            <Box pr={6} pt={4} display="flex" justifyContent="end">
              <Stack columnGap={3} maxWidth={"45%"}>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={"15px"}
                  justifyContent="end"
                >
                  <Card borderRadius="3xl" bg={"blue.400"} color={"white"}>
                    <CardBody p={3} pt={2} pb={2}>
                      <Text fontSize={"sm"}>hello its me yoooo h</Text>
                    </CardBody>
                  </Card>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={"15px"}
                  justifyContent="end"
                >
                  <Card borderRadius="3xl" bg={"blue.400"} color={"white"}>
                    <CardBody p={3} pt={2} pb={2}>
                      <Text fontSize={"sm"}>hello its me yoooo</Text>
                    </CardBody>
                  </Card>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Stack>
        <Card>
          <CardBody>
            <Input placeholder="Message..." size="lg" borderRadius="3xl" />
          </CardBody>
        </Card>
      </Card>
    </Box>
  );
};

export default MessagesBox;
