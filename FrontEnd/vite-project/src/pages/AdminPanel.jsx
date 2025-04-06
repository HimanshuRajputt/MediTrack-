import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Text,
  Flex,
  Badge,
  useToast,
  Spinner,
  useBreakpointValue,
  TableContainer,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

const AdminPanel = () => {
  const { token } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  // Responsive adjustments based on screen size
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const tableSize = useBreakpointValue({ base: "sm", md: "md" });
  const fontSize = useBreakpointValue({ base: "xl", md: "2xl" });

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://medtrack-bbackend.onrender.com/prescriptions",
          {
            headers: { token },
          }
        );
        setPrescriptions(response.data);
        setFilteredPrescriptions(response.data);
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

    fetchPrescriptions();
  }, [token, toast]);

  useEffect(() => {
    // Filter prescriptions based on search term
    if (searchTerm.trim() === "") {
      setFilteredPrescriptions(prescriptions);
    } else {
      const filtered = prescriptions.filter(
        (prescription) =>
          prescription.userId.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          prescription.userId._id
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredPrescriptions(filtered);
    }
  }, [searchTerm, prescriptions]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://medtrack-bbackend.onrender.com/prescriptions/${id}/${status}`,
        {},
        {
          headers: { token },
        }
      );
      setPrescriptions((prev) => {
        const updated = prev.map((p) => (p._id === id ? { ...p, status } : p));
        // Also update filtered results
        setFilteredPrescriptions(
          filteredPrescriptions.map((p) =>
            p._id === id ? { ...p, status } : p
          )
        );
        return updated;
      });
      toast({
        title: `Prescription ${status}`,
        status: status === "approved" ? "success" : "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error(`Error updating prescription: ${error.message}`);
      toast({
        title: "Error updating status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusBadge = (status) => {
    let colorScheme;
    switch (status) {
      case "approved":
        colorScheme = "green";
        break;
      case "rejected":
        colorScheme = "red";
        break;
      default:
        colorScheme = "yellow";
    }
    return <Badge colorScheme={colorScheme}>{status}</Badge>;
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Box p={{ base: 3, md: 5 }} maxW="100%">
      <Flex direction="column" mb={6}>
        <Text fontSize={fontSize} fontWeight="bold" mb={2}>
          Admin Panel
        </Text>
        <Text color="gray.600">Manage and process prescription approvals</Text>
      </Flex>

      {/* Search Section */}
      <Box mb={6}>
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by user name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="md"
            focusBorderColor="teal.400"
          />
          {searchTerm && (
            <InputRightElement>
              <IconButton
                size="sm"
                icon={<CloseIcon />}
                variant="ghost"
                onClick={handleClearSearch}
                aria-label="Clear search"
              />
            </InputRightElement>
          )}
        </InputGroup>
      </Box>

      {loading ? (
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : filteredPrescriptions.length === 0 ? (
        <Box textAlign="center" p={4} borderRadius="md" bg="gray.50">
          <Text>
            {searchTerm
              ? "No prescriptions match your search"
              : "No prescriptions found"}
          </Text>
        </Box>
      ) : (
        <TableContainer>
          <Table
            variant="simple"
            colorScheme="teal"
            size={tableSize}
            overflow="auto"
          >
            <Thead bg="teal.50">
              <Tr>
                <Th>User Name</Th>
                <Th display={{ base: "none", md: "table-cell" }}>User ID</Th>
                <Th>File</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredPrescriptions.map((prescription) => (
                <Tr key={prescription._id}>
                  <Td fontWeight="medium">{prescription.userId.name}</Td>
                  <Td
                    display={{ base: "none", md: "table-cell" }}
                    fontSize="sm"
                  >
                    {prescription.userId._id}
                  </Td>
                  <Td>
                    <a
                      href={`https://medtrack-bbackend.onrender.com${prescription.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "teal.600", textDecoration: "underline" }}
                    >
                      {prescription.fileName}
                    </a>
                  </Td>
                  <Td>{getStatusBadge(prescription.status)}</Td>
                  <Td>
                    {prescription.status === "pending" && (
                      <Flex
                        direction={{ base: "column", md: "row" }}
                        gap={{ base: 2, md: 3 }}
                      >
                        <Button
                          colorScheme="green"
                          size={buttonSize}
                          onClick={() =>
                            updateStatus(prescription._id, "approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          colorScheme="red"
                          size={buttonSize}
                          onClick={() =>
                            updateStatus(prescription._id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </Flex>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminPanel;
