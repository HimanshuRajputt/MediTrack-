import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Input,
  Button,
  Heading,
  Text,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  useToast,
  Flex,
  Link,
  useColorModeValue,
  Image,
  Hide,
  Show,
  Select,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(
        "https://medtrack-bbackend.onrender.com/auth/signup",
        formData
      );
      toast({
        title: "Signup successful!",
        status: "success",
        duration: 2000,
        position: "top",
      });

      // Auto-login after signup
      // const res = await axios.post("http://localhost:5000/auth/login", {
      //   email: formData.email,
      //   password: formData.password,
      // });

      // login(res.data.token, res.data.role);
      navigate("/login");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error.response?.data.message || "Something went wrong",
        status: "error",
        duration: 2000,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const illustrationBg = useColorModeValue("#DEE6F1");
  const headingColor = useColorModeValue("blue.600", "blue.300");

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }}>
      {/* Signup Form Side */}
      <Flex
        flex={1}
        align="center"
        justify="center"
        bg={bgColor}
        p={{ base: 8, md: 16 }}
      >
        <Box w="full" maxW="md">
          {/* Show only on mobile */}
          <Show below="md">
            <Flex direction="column" align="center" mb={8}>
              <Heading size="lg" color={headingColor} textAlign="center">
                MedTrack
              </Heading>
              <Text textAlign="center" fontSize="md">
                Join thousands of users managing their medications effectively
              </Text>
            </Flex>
          </Show>

          <Box textAlign="left" mb={8}>
            <Heading size="xl">Create Account</Heading>
            <Text mt={2} color="gray.500">
              Sign up to start managing your medications
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="flex-start">
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  size="lg"
                  focusBorderColor="blue.400"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your-email@example.com"
                  size="lg"
                  focusBorderColor="blue.400"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    size="lg"
                    focusBorderColor="blue.400"
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      variant="ghost"
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  size="lg"
                  focusBorderColor="blue.400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl> */}

              <Button
                colorScheme="blue"
                size="lg"
                width="full"
                type="submit"
                isLoading={isLoading}
                loadingText="Creating Account"
                mt={2}
              >
                Create Account
              </Button>
            </VStack>
          </form>

          <Text mt={8} textAlign="center">
            Already have an account?{" "}
            <Link color="blue.500" href="/login" fontWeight="semibold">
              Sign In
            </Link>
          </Text>
        </Box>
      </Flex>
      {/* Illustration Side */}
      <Hide below="md">
        <Flex
          flex={1}
          bg={illustrationBg}
          justify="center"
          align="center"
          p={8}
        >
          <Box maxW="md">
            <Image
            transform="scale(1.12)"
              src="../../jd.jpeg"
              alt="Signup Illustration"
              // fallbackSrc="https://via.placeholder.com/500x500?text=MedTrack"
            />
            <Heading mt={6} size="lg" color={headingColor} textAlign="center">
              MedTrack
            </Heading>
            <Text mt={3} textAlign="center" fontSize="lg" maxW="md">
              Join thousands of users managing their medications effectively
            </Text>
          </Box>
        </Flex>
      </Hide>
    </Flex>
  );
};

export default Signup;
