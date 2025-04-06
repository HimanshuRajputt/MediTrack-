import React from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  Stack,
  Link,
  Input,
  Button,
  Divider,
  HStack,
  VStack,
  Image,
  Icon,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { PhoneIcon, EmailIcon, InfoIcon } from "@chakra-ui/icons";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Box
      bg={bgColor}
      color={textColor}
      borderTop="1px"
      borderColor={borderColor}
    >
      <Container maxW="container.xl" py={12}>
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr 1fr" }} gap={8}>
          {/* Company Info */}
          <Box>
            <Heading
              size="md"
              mb={4}
              color={useColorModeValue("gray.800", "white")}
            >
              MedTrack
            </Heading>
            <Text mb={4}>
              Your trusted medication reminder and management system designed to
              help you stay on track with your treatment plan.
            </Text>
            <HStack spacing={4} mt={6}>
              <IconButton
                aria-label="Facebook"
                icon={<FaFacebook />}
                size="md"
                colorScheme="blue"
                variant="ghost"
                rounded="full"
              />
              <IconButton
                aria-label="Twitter"
                icon={<FaTwitter />}
                size="md"
                colorScheme="blue"
                variant="ghost"
                rounded="full"
              />
              <IconButton
                aria-label="Instagram"
                icon={<FaInstagram />}
                size="md"
                colorScheme="blue"
                variant="ghost"
                rounded="full"
              />
              <IconButton
                aria-label="LinkedIn"
                icon={<FaLinkedin />}
                size="md"
                colorScheme="blue"
                variant="ghost"
                rounded="full"
              />
            </HStack>
          </Box>

          {/* Quick Links */}
          <Box>
            <Heading
              size="sm"
              mb={4}
              color={useColorModeValue("gray.800", "white")}
            >
              Quick Links
            </Heading>
            <Stack spacing={2}>
              <Link href="#" _hover={{ color: hoverColor }}>
                Home
              </Link>
              <Link href="#" _hover={{ color: hoverColor }}>
                About Us
              </Link>
              <Link href="#" _hover={{ color: hoverColor }}>
                Features
              </Link>
              <Link href="#" _hover={{ color: hoverColor }}>
                Pricing
              </Link>
              <Link href="#" _hover={{ color: hoverColor }}>
                Testimonials
              </Link>
              <Link href="#" _hover={{ color: hoverColor }}>
                Contact
              </Link>
            </Stack>
          </Box>

          {/* Support */}
          <Box>
            <Heading
              size="sm"
              mb={4}
              color={useColorModeValue("gray.800", "white")}
            >
              Support
            </Heading>
            <Stack spacing={2}>
              <Link href="#" _hover={{ color: hoverColor }}>
                Help Center
              </Link>
              <Link href="#" _hover={{ color: hoverColor }}>
                FAQs
              </Link>
              <Link href="#" _hover={{ color: hoverColor }}>
                Privacy Policy
              </Link>
              <Link href="#" _hover={{ color: hoverColor }}>
                Terms of Service
              </Link>
              <Link href="#" _hover={{ color: hoverColor }}>
                Cookie Policy
              </Link>
            </Stack>
          </Box>

          {/* Newsletter */}
          <Box>
            <Heading
              size="sm"
              mb={4}
              color={useColorModeValue("gray.800", "white")}
            >
              Stay Updated
            </Heading>
            <Text mb={4}>Subscribe to our newsletter for tips and updates</Text>
            <Stack spacing={2}>
              <Input
                placeholder="Your email address"
                bg={useColorModeValue("white", "gray.800")}
                border="1px"
                borderColor={borderColor}
                _hover={{
                  borderColor: "blue.500",
                }}
              />
              <Button colorScheme="blue" width="full">
                Subscribe
              </Button>
            </Stack>
          </Box>
        </Grid>

        <Divider my={8} borderColor={borderColor} />

        {/* Contact Info */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          wrap="wrap"
          gap={4}
        >
          <HStack spacing={6} mb={{ base: 4, md: 0 }}>
            <HStack>
              <Icon as={PhoneIcon} color="blue.500" />
              <Text>+1 (555) 123-4567</Text>
            </HStack>
            <HStack>
              <Icon as={EmailIcon} color="blue.500" />
              <Text>support@medtrack.com</Text>
            </HStack>
          </HStack>

          <Text fontSize="sm">
            © {new Date().getFullYear()} MedTrack. All rights reserved.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
