import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Flex,
  Button,
  Spacer,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useDisclosure,
  HStack,
  Container,
  Text,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const { token, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const isMobile = useBreakpointValue({ base: true, md: false });

  // const bgColor = useColorModeValue(
  //   "linear-gradient(to right, #4F46E5, #6B46C1)",
  //   "gray.800"
  // );
  const bgColor = useColorModeValue(
    "black"
  );
  // const buttonHoverBg = useColorModeValue("blue.700");

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (isOpen) onClose();
  };

  const NavLinks = () => (
    <>
      {token ? (
        <>
          {role === "admin" && (
            <Link to="/admin-dashboard" onClick={onClose}>
              <Button
                bg="black"
                color="white"
                position="relative"
                overflow="hidden"
                _hover={{
                  // bg: "blue.700",
                  // scale: "",
                  fontSize: "15px",
                  transform: "translateY(-5px)" /* Moves text slightly up */,
                }}
                transition="0.5s ease-in-out"
                size={isMobile ? "md" : "sm"}
                w={isMobile ? "full" : "auto"}
              >
                Admin Panel
              </Button>
            </Link>
          )}
          <Link to="/medications" onClick={onClose}>
            <Button
              bg="black"
              color="white"
              position="relative"
              overflow="hidden"
              _hover={{
                // bg: "blue.700",
                // scale: "",
                fontSize: "15px",
                transform: "translateY(-5px)" /* Moves text slightly up */,
              }}
              transition="0.5s ease-in-out"
              size={isMobile ? "md" : "sm"}
              w={isMobile ? "full" : "auto"}
            >
              Medications
            </Button>
          </Link>
          <Link to="/prescriptions" onClick={onClose}>
            <Button
              bg="black"
              color="white"
              position="relative"
              overflow="hidden"
              colorScheme="blue"
              _hover={{
                // bg: "blue.700",
                // scale: "",
                fontSize: "15px",
                transform: "translateY(-5px)" /* Moves text slightly up */,
              }}
              transition="0.5s ease-in-out"
              size={isMobile ? "md" : "sm"}
              w={isMobile ? "full" : "auto"}
            >
              Prescriptions
            </Button>
          </Link>
          <Button
            variant="solid"
            colorScheme="red"
            onClick={handleLogout}
            _hover={{
              // bg: "blue.700",
              // scale: "",
              fontSize: "15px",
              transform: "translateY(-5px)" /* Moves text slightly up */,
            }}
            transition="0.5s ease-in-out"
            size={isMobile ? "md" : "sm"}
            w={isMobile ? "full" : "auto"}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link to="/login" onClick={onClose}>
            <Button
              bg="black"
              color="white"
              position="relative"
              overflow="hidden"
              colorScheme="blue"
              fontSize="lg"
              _hover={{
                // bg: "blue.700",
                // scale: "",
                fontSize: "15px",
                transform: "translateY(-5px)" /* Moves text slightly up */,
              }}
              transition="0.5s ease-in-out"
              size={isMobile ? "md" : "sm"}
              w={isMobile ? "full" : "auto"}
            >
              Login
            </Button>
          </Link>
          <Link to="/signup" onClick={onClose}>
            <Button
              bg="black"
              color="white"
              position="relative"
              overflow="hidden"
              colorScheme="blue"
              fontSize="lg"
              _hover={{
                // bg: "blue.700",
                // scale: "",
                fontSize: "15px",
                transform: "translateY(-5px)" /* Moves text slightly up */,
              }}
              transition="0.5s ease-in-out"
              size={isMobile ? "md" : "sm"}
              w={isMobile ? "full" : "auto"}
            >
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <Box
      bg={bgColor}
      py={3}
      px={4}
      color="white"
      boxShadow="lg"
      position="sticky"
      top="0"
      zIndex="100"
    >
      <Container maxW="container.xl">
        <Flex align="center">
          <Link to="/">
            <HStack spacing={2}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                _hover={{
                  // bg: "blue.700",
                  // scale: "",
                  fontSize: "21px",
                  transform: "translateY(-5px)" /* Moves text slightly up */,
                }}
                transition="0.5s ease-in-out"
                size={isMobile ? "md" : "sm"}
                w={isMobile ? "full" : "auto"}
              >
                MedTrack
              </Text>
            </HStack>
          </Link>

          <Spacer />

          {isMobile ? (
            <IconButton
              ref={btnRef}
              icon={<HamburgerIcon />}
              color="white"
              variant="ghost"
              onClick={onOpen}
              aria-label="Open menu"
              fontSize="20px"
              _hover={{ bg: "blue.900" }}
            />
          ) : (
            <HStack spacing={3}>
              <NavLinks />
            </HStack>
          )}
        </Flex>
      </Container>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent height="35vh" borderRadius="10px">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Text color="blue.600" fontSize="xl" fontWeight="bold">
              MedTrack
            </Text>
          </DrawerHeader>
          <DrawerBody py={4} maxH="40vh" overflowY="auto">
            <VStack spacing={4} align="stretch">
              <NavLinks />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
