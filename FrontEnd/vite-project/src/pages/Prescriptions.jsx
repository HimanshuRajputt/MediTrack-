/* eslint-disable no-undef */
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  Box,
  Button,
  Text,
  VStack,
  Spinner,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Input,
  Heading,
  Flex,
  Badge,
  Grid,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Container,
  useToast,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const Prescriptions = () => {
  const { token, role } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();

  // Responsive values
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });
  const containerPadding = useBreakpointValue({ base: 3, md: 6 });

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(
        "https://medtrack-bbackend.onrender.com/prescriptions",
        {
          headers: { token },
        }
      );
      console.log("Prescriptions:", res.data);
      setPrescriptions(res.data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast({
        title: "Error fetching prescriptions",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [token]);

  const handleAction = async (id, status) => {
    try {
      console.log(status)
      const res = await axios.put(
        `https://medtrack-bbackend.onrender.com/prescriptions/${id}/${status}`,
        {},
        // { status: action },
        { headers: { token } }
      );
      console.log(`${status} successful:`, res.data);
      setPrescriptions((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status } : p))
      );
      toast({
        title: `Prescription ${status}`,
        status: status === "approved" ? "success" : "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
      toast({
        title: `Error updating status`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Please select a file",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        "https://medtrack-bbackend.onrender.com/prescriptions",
        formData,
        {
          headers: { token },
        }
      );
      console.log("Upload successful:", res.data);
      setPrescriptions((prev) => [...prev, res.data.prescription]);
      setSelectedFile(null);
      onClose();
      toast({
        title: "Prescription uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error uploading file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <Container
      maxW="container.xl"
      py={containerPadding}
      px={useBreakpointValue({ base: 3, md: 6 })}
    >
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        direction={useBreakpointValue({ base: "column", sm: "row" })}
        gap={useBreakpointValue({ base: 3, sm: 0 })}
      >
        <Heading
          as="h1"
          size={headingSize}
          mb={useBreakpointValue({ base: 2, sm: 0 })}
        >
          Prescriptions
        </Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={onOpen}
          size={buttonSize}
          borderRadius="full"
          width={useBreakpointValue({ base: "100%", sm: "auto" })}
        >
          Add Prescription
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" h="300px">
          <Spinner size="xl" thickness="4px" color="blue.500" />
        </Flex>
      ) : (
        <Box>
          {prescriptions.length > 0 ? (
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={({ base: 3, md: 6 })}
            >
              {prescriptions.map((prescription) => (
                <Card
                  key={prescription._id}
                  overflow="hidden"
                  variant="outline"
                  boxShadow="md"
                  borderRadius="lg"
                  transition="transform 0.2s"
                  _hover={{ transform: "translateY(-5px)" }}
                >
                  <CardBody p={({ base: 3, md: 4 })}>
                    <Flex
                      justify="space-between"
                      align="center"
                      mb={3}
                      direction={({
                        base: "column",
                        sm: "row",
                      })}
                      gap={2}
                    >
                      <Text
                        fontWeight="bold"
                        noOfLines={1}
                        fontSize={({ base: "sm", md: "md" })}
                      >
                        {prescription.fileName}
                      </Text>
                      <Badge
                        colorScheme={getStatusColor(prescription.status)}
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize={({ base: "xs", md: "sm" })}
                      >
                        {prescription.status}
                      </Badge>
                    </Flex>
                    <Divider
                      width="80%"
                      borderColor="blue.400"
                      borderWidth="2px"
                      mb={2}
                    />
                    <Text
                      fontSize={({ base: "xs", md: "sm" })}
                    >
                      {localStorage.getItem("role") === "admin"
                        ? `Patient: ${prescription.userId.name}`
                        : ""}
                    </Text>
                    <Text
                      fontSize={({ base: "xs", md: "sm" })}
                    >
                      {localStorage.getItem("role") === "admin"
                        ? `Patient ID: ${prescription.userId._id}`
                        : ""}
                    </Text>
                    <Box
                      borderRadius="md"
                      overflow="hidden"
                      height={({
                        base: "150px",
                        md: "200px",
                      })}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      bg="gray.100"
                      mt={2}
                    >
                      <Image
                        src={`https://medtrack-bbackend.onrender.com${prescription.fileUrl}`}
                        alt="Prescription"
                        objectFit="contain"
                        maxH="100%"
                        maxW="100%"
                      />
                    </Box>
                  </CardBody>

                  {role === "admin" && prescription.status === "pending" && (
                    <>
                      <Divider />
                      <CardFooter p={({ base: 2, md: 3 })}>
                        <Flex width="100%" justify="space-between">
                          <Button
                            colorScheme="green"
                            size={({ base: "xs", md: "sm" })}
                            flex="1"
                            mr={2}
                            onClick={() =>
                              handleAction(prescription._id, "approved")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            colorScheme="red"
                            size={({ base: "xs", md: "sm" })}
                            flex="1"
                            onClick={() =>
                              handleAction(prescription._id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </Flex>
                      </CardFooter>
                    </>
                  )}
                </Card>
              ))}
            </Grid>
          ) : (
            <Box
              textAlign="center"
              p={({ base: 5, md: 10 })}
              borderRadius="lg"
              bg="gray.50"
              borderWidth="1px"
            >
              <Text
                fontSize={({ base: "md", md: "lg" })}
                color="gray.500"
              >
                No prescriptions available. Upload your first prescription.
              </Text>
              <Button
                mt={4}
                colorScheme="blue"
                onClick={onOpen}
                leftIcon={<AddIcon />}
                size={buttonSize}
              >
                Add Prescription
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={useBreakpointValue({ base: "sm", md: "md" })}
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader fontSize={useBreakpointValue({ base: "lg", md: "xl" })}>
            Upload Prescription
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="md"
              p={useBreakpointValue({ base: 4, md: 6 })}
              textAlign="center"
            >
              <Input
                type="file"
                onChange={handleFileChange}
                p={2}
                accept="image/*"
                size={useBreakpointValue({ base: "sm", md: "md" })}
              />
              <Text
                fontSize={useBreakpointValue({ base: "xs", md: "sm" })}
                color="gray.500"
                mt={2}
              >
                Supported formats: JPG, PNG, PDF
              </Text>
            </Box>
            {selectedFile && (
              <Text
                mt={2}
                fontSize={({ base: "xs", md: "sm" })}
              >
                Selected: {selectedFile.name}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleUpload}
              size={buttonSize}
            >
              Upload
            </Button>
            <Button variant="ghost" onClick={onClose} size={buttonSize}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Prescriptions;
