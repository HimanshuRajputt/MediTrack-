import { useContext } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { AuthContext } from "../context/AuthContext";
import MedicationReminder from "../components/MedicationReminder";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <Box p={6}>
      <Heading size="lg">Welcome, {user?.name}!</Heading>
      <Text fontSize="lg" mt={2}>
        Manage your prescriptions and medication schedules here.
      </Text>

      {/* Medication Reminder Section */}
      <VStack spacing={6} mt={6} align="stretch">
        <MedicationReminder />
      </VStack>
    </Box>
  );
};

export default Dashboard;
