import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  Stack,
  Image,
  Icon,
  useColorModeValue,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  TimeIcon,
  BellIcon,
  CalendarIcon,
  StarIcon,
} from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import Footer from "./Footer";

// Feature component
const Feature = ({ title, text, icon }) => {
  return (
    <Card
      direction="column"
      overflow="hidden"
      variant="outline"
      p={6}
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="xl"
      boxShadow="md"
      height="100%"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
      }}
    >
      <Box
        rounded="full"
        bg={useColorModeValue("blue.50", "blue.900")}
        p={3}
        w="max-content"
        color="blue.500"
        mb={4}
      >
        <Icon as={icon} w={6} h={6} />
      </Box>
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text color={useColorModeValue("gray.600", "gray.300")}>{text}</Text>
    </Card>
  );
};

// Testimonial component
const Testimonial = ({ name, role, content, rating }) => {
  return (
    <Card
      bg={useColorModeValue("white", "gray.800")}
      p={6}
      boxShadow="lg"
      borderRadius="lg"
      maxW="md"
      height="100%"
    >
      <CardBody>
        <HStack mb={3}>
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} color={i < rating ? "yellow.400" : "gray.300"} />
          ))}
        </HStack>
        <Text fontSize="md" fontStyle="italic" mb={4}>
          "{content}"
        </Text>
        <Divider my={4} />
        <HStack>
          <Box
            rounded="full"
            bg="blue.500"
            color="white"
            fontWeight="bold"
            w="40px"
            h="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {name.charAt(0)}
          </Box>
          <Box>
            <Text fontWeight="bold">{name}</Text>
            <Text fontSize="sm" color="gray.500">
              {role}
            </Text>
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );
};

const Home = () => {
  const bgGradient = useColorModeValue(
    "linear(to-b, blue.50, white)",
    "linear(to-b, gray.900, gray.800)"
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={bgGradient} pt={20} pb={32}>
        <Container maxW="container.xl">
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={10}
            alignItems="center"
          >
            <Box>
              <Badge
                colorScheme="blue"
                rounded="full"
                px={3}
                py={1}
                fontSize="sm"
                mb={6}
              >
                Never Miss A Dose Again
              </Badge>
              <Heading
                as="h1"
                size="2xl"
                fontWeight="bold"
                lineHeight="shorter"
                mb={6}
              >
                Your Personal Medication Reminder & Management System
              </Heading>
              <Text
                fontSize="xl"
                color={useColorModeValue("gray.600", "gray.300")}
                mb={8}
              >
                Stay on track with your treatment plan and manage your
                prescriptions with ease. Get timely reminders, track
                medications, and monitor your health progress all in one place.
              </Text>
              <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                <Link
                  to={localStorage.getItem("token") ? "/medications" : "/login"}
                >
                  <Button
                    size="lg"
                    colorScheme="blue"
                    height="60px"
                    px={8}
                    fontSize="md"
                    fontWeight="bold"
                    boxShadow="md"
                  >
                    Get Started
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                  height="60px"
                  px={8}
                  fontSize="md"
                  fontWeight="bold"
                >
                  How It Works
                </Button>
              </Stack>
            </Box>
            <Box position="relative" display={{ base: "none", lg: "block" }}>
              {/* <Box
                // position="absolute"
                // width="300px"
                // height="300px"
                // bg="blue.500"
                // opacity="0.2"
                // borderRadius="full"
                // top="-20px"
                // right="-20px"
              /> */}
              <Image
                borderRadius="3xl"
                src="../../ilus.jpg"
                alt="Medication Management"
                // borderRadius="2xl"
                boxShadow="2xl"
                position="relative"
                zIndex={1}
              />
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxW="container.xl" mt="-80px" position="relative" zIndex={2}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>
          <Card p={6} boxShadow="xl" borderRadius="lg">
            <Stat>
              <StatLabel fontSize="md" fontWeight="medium">
                Active Users
              </StatLabel>
              <StatNumber fontSize="4xl" fontWeight="bold" color="blue.500">
                10,000+
              </StatNumber>
              <StatHelpText>Trusted by thousands</StatHelpText>
            </Stat>
          </Card>
          <Card p={6} boxShadow="xl" borderRadius="lg">
            <Stat>
              <StatLabel fontSize="md" fontWeight="medium">
                Reminders Sent
              </StatLabel>
              <StatNumber fontSize="4xl" fontWeight="bold" color="green.500">
                1M+
              </StatNumber>
              <StatHelpText>Helping people stay on track</StatHelpText>
            </Stat>
          </Card>
          <Card p={6} boxShadow="xl" borderRadius="lg">
            <Stat>
              <StatLabel fontSize="md" fontWeight="medium">
                Medication Adherence
              </StatLabel>
              <StatNumber fontSize="4xl" fontWeight="bold" color="purple.500">
                94%
              </StatNumber>
              <StatHelpText>Improved health outcomes</StatHelpText>
            </Stat>
          </Card>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12}>
          <Box textAlign="center" maxW="container.md" mx="auto">
            <Heading mb={4}>How MedTrack Helps You</Heading>
            <Text
              fontSize="lg"
              color={useColorModeValue("gray.600", "gray.300")}
            >
              Our intelligent platform makes medication management effortless
              and effective
            </Text>
          </Box>

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={10}
            width="full"
          >
            <Feature
              icon={BellIcon}
              title="Smart Reminders"
              text="Get timely notifications for every dose on your schedule, customized to your preferences and lifestyle."
            />
            <Feature
              icon={CalendarIcon}
              title="Medication Scheduling"
              text="Easily set up complex medication schedules, including timing, dosage, and special instructions."
            />
            <Feature
              icon={TimeIcon}
              title="Refill Alerts"
              text="Never run out of your prescriptions with automatic refill reminders before your medications run low."
            />
            <Feature
              icon={CheckCircleIcon}
              title="Adherence Tracking"
              text="Monitor your medication adherence over time with simple tracking and helpful insights."
            />
            <Feature
              icon={StarIcon}
              title="Prescription Management"
              text="Upload and organize your prescriptions in one secure place for easy access and renewal."
            />
            <Feature
              icon={CheckCircleIcon}
              title="Health Reports"
              text="Generate detailed reports on your medication history to share with your healthcare providers."
            />
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Testimonials */}
      <Box bg={useColorModeValue("gray.50", "gray.800")} py={20}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <Box textAlign="center" maxW="container.md" mx="auto">
              <Heading mb={4}>What Our Users Say</Heading>
              <Text
                fontSize="lg"
                color={useColorModeValue("gray.600", "gray.300")}
              >
                Join thousands of satisfied users who have improved their
                medication adherence
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} width="full">
              <Testimonial
                name="Sarah Johnson"
                role="Managing multiple prescriptions"
                rating={5}
                content="MedTrack has been a lifesaver for me. Managing multiple medications used to be so stressful, but now I never miss a dose. The reminders are perfectly timed."
              />
              <Testimonial
                name="Michael Chen"
                role="Caring for elderly parent"
                rating={5}
                content="As a caregiver for my father, this app gives me peace of mind. I can track his medications remotely and make sure he's staying on schedule."
              />
              <Testimonial
                name="Emily Rodriguez"
                role="Busy professional"
                rating={4}
                content="With my hectic schedule, I was constantly forgetting my medications. The smart reminders fit perfectly into my daily routine, and the interface is so intuitive."
              />
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      {localStorage.getItem("token") ? (
        ""
      ) : (
        <Box py={20}>
          <Container maxW="container.lg">
            <Card
              direction={{ base: "column", md: "row" }}
              overflow="hidden"
              variant="outline"
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bg={useColorModeValue("blue.50", "blue.900")}
              borderRadius="2xl"
              boxShadow="xl"
            >
              <Image
                objectFit="fit"
                maxW={{ base: "100%", md: "300px" }}
                src="../../Medtrack internal.png"
                alt="App screenshot"
                display={{ base: "none", md: "block" }}
              />
              <CardBody p={8}>
                <Heading size="xl" mb={4}>
                  Start Managing Your Medications Today
                </Heading>
                <Text py={2} fontSize="lg" mb={6}>
                  Join thousands of users who have improved their health
                  outcomes with better medication management. Setting up your
                  account takes less than a minutes.
                </Text>
                <HStack spacing={4}>
                  <Link to="/login">
                    <Button colorScheme="blue" size="lg" px={8}>
                      Create Free Account
                    </Button>
                  </Link>
                  <Button variant="ghost" colorScheme="blue" size="lg">
                    Learn More
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          </Container>
        </Box>
      )}

      <Footer />
    </Box>
  );
};

export default Home;
