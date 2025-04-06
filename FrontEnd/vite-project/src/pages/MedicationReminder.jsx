import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  useToast,
} from "@chakra-ui/react";

const MedicationReminder = () => {
  const [medicationTime, setMedicationTime] = useState("");
  const [reminders, setReminders] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const savedReminders =
      JSON.parse(localStorage.getItem("medicationReminders")) || [];
    setReminders(savedReminders);
  }, []);

  const handleAddReminder = () => {
    if (!medicationTime) {
      toast({
        title: "Please enter a time",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    const newReminder = { time: medicationTime, id: Date.now() };
    const updatedReminders = [...reminders, newReminder];

    setReminders(updatedReminders);
    localStorage.setItem(
      "medicationReminders",
      JSON.stringify(updatedReminders)
    );
    setMedicationTime("");
    toast({
      title: "Reminder set successfully",
      status: "success",
      duration: 3000,
    });
  };

  useEffect(() => {
    const checkReminders = () => {
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      reminders.forEach((reminder) => {
        if (reminder.time === currentTime) {
          toast({
            title: "Medication Reminder",
            description: `Time to take your medicine at ${reminder.time}`,
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders, toast]);

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="lg">
      <Heading size="md" mb={4}>
        Set Medication Reminder
      </Heading>
      <VStack spacing={4}>
        <Input
          type="time"
          value={medicationTime}
          onChange={(e) => setMedicationTime(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleAddReminder}>
          Set Reminder
        </Button>
      </VStack>
    </Box>
  );
};

export default MedicationReminder;
