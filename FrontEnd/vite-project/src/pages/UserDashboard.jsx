import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  FormLabel,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
  const { user, token } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(
        "https://medtrack-bbackend.onrender.com/prescriptions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPrescriptions(
        response.data.filter((p) => p.userId._id === user.userId)
      );
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Please select a file",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post(
        "https://medtrack-bbackend.onrender.com/prescriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        title: "Prescription uploaded successfully!",
        status: "success",
        duration: 2000,
      });
      fetchPrescriptions();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading prescription:", error);
      toast({ title: "Upload failed", status: "error", duration: 2000 });
    }
  };

  return (
    <Box p={5}>
      <Heading mb={4}>User Dashboard - My Prescriptions</Heading>

      <Box mb={5}>
        <FormLabel>Upload New Prescription</FormLabel>
        <Input type="file" onChange={handleFileChange} mb={2} />
        <Button colorScheme="blue" onClick={handleUpload}>
          Upload
        </Button>
      </Box>

      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>File</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {prescriptions.map((prescription) => (
              <Tr key={prescription._id}>
                <Td>
                  <a
                    href={`https://medtrack-bbackend.onrender.com/${prescription.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Prescription
                  </a>
                </Td>
                <Td>{prescription.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default UserDashboard;
