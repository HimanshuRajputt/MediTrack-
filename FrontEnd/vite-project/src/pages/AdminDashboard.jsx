import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
} from "@chakra-ui/react";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(
        "https://medtrack-bbackend.onrender.com/prescriptions",
        {
          // const res = await axios.get("http://localhost:5000/prescriptions", {
          headers: { token },
        }
      );
      setPrescriptions(res.data);
    } catch (error) {
      toast({
        title: `Error updating status Error is :-> ${error}`,
        status: "error",
        duration: 3000,
      });
    }
  };

  const updatePrescriptionStatus = async (id, status) => {
    try {
      await axios.put(
        `https://medtrack-bbackend.onrender.com/prescriptions/${id}/${status}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: `Prescription ${status}`,
        status: "success",
        duration: 3000,
      });
      fetchPrescriptions(); // Refresh the list
    } catch (error) {
      toast({
        title: `Error updating status Error is :-> ${error}`,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Admin Dashboard</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>User ID</Th>
            {/* <Th>User Name</Th> */}
            <Th>File</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {prescriptions.map((prescription) => (
            <Tr key={prescription._id}>
              <Td>{prescription.userId}</Td>
              {/* <Td>D</Td> */}
              <Td>
                <a
                  href={`https://medtrack-bbackend.onrender.com/uploads/${prescription.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </Td>
              <Td>
                <Badge
                  colorScheme={
                    prescription.status === "approved"
                      ? "green"
                      : prescription.status === "rejected"
                      ? "red"
                      : "yellow"
                  }
                >
                  {prescription.status}
                </Badge>
              </Td>
              <Td>
                {prescription.status === "pending" && (
                  <>
                    <Button
                      colorScheme="green"
                      size="sm"
                      mr={2}
                      onClick={() =>
                        updatePrescriptionStatus(prescription._id, "approve")
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() =>
                        updatePrescriptionStatus(prescription._id, "reject")
                      }
                    >
                      Reject
                    </Button>
                  </>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AdminDashboard;
