import { useState } from "react";
import { useAuth } from "../context/AuthContext";
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
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://medtrack-bbackend.onrender.com/auth/login",
        formData
      );
      login(res.data.token, res.data.role);
      toast({
        title: "Login successful!",
        status: "success",
        duration: 2000,
        position: "top",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data.message || "Invalid credentials",
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
  const illustrationBg = useColorModeValue("#DFEFFE");
  const headingColor = useColorModeValue("blue.600", "blue.300");

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }}>
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
              transform="scale(1.10)"
              src="../../j.jpg"
              alt="Login Illustration"
              
            />
            <Heading mt={6} size="lg" color={headingColor} textAlign="center">
              MedTrack
            </Heading>
            <Text mt={3} textAlign="center" fontSize="lg" maxW="md">
              Your personal medication reminder & management system
            </Text>
          </Box>
        </Flex>
      </Hide>

      {/* Login Form Side */}
      <Flex
        flex={1}
        align="center"
        justify="center"
        bg={bgColor}
        p={{ base: 8, md: 16 }}
      >
        <Box w="full" maxW="md"   >
          {/* Show only on mobile */}
          <Show below="md">
            <Flex direction="column" align="center" mb={8}>
              <Heading size="lg" color={headingColor} textAlign="center">
                MedTrack
              </Heading>
              <Text textAlign="center" fontSize="md">
                Your personal medication reminder & management system
              </Text>
            </Flex>
          </Show>

          <Box textAlign="left" mb={8}>
            <Heading size="xl">Welcome Back</Heading>
            <Text mt={2} color="gray.500">
              Please sign in to your account
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="flex-start">
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
                    placeholder="Enter your password"
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

              <Flex justify="space-between" w="full">
                <Box></Box> {/* Empty box for spacing */}
                <Link color="blue.500" fontSize="sm">
                  Forgot Password?
                </Link>
              </Flex>

              <Button
                colorScheme="blue"
                size="lg"
                width="full"
                type="submit"
                isLoading={isLoading}
                loadingText="Signing In"
                mt={2}
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <Text mt={8} textAlign="center">
            Don't have an account?{" "}
            <Link color="blue.500" href="/signup" fontWeight="semibold">
              Create Account
            </Link>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;
