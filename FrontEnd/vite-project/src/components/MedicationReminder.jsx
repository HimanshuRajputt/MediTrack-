import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";

const MedicationReminder = ({ medications }) => {
  const [showReminder, setShowReminder] = useState(false);
  const [medicationToTake, setMedicationToTake] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const checkMedicationTime = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // Format: "HH:MM"

      medications.forEach((med) => {
        med.timeSlots.forEach((time) => {
          if (time === currentTime) {
            setMedicationToTake(med);
            setShowReminder(true);
          }
        });
      });
    };

    const timer = setInterval(checkMedicationTime, 60000); // Check every 1 minute
    return () => clearInterval(timer);
  }, [medications]);

  const handleTakeMedication = () => {
    setShowReminder(false);
    toast({
      title: "Medication Taken",
      description: `You have taken ${medicationToTake?.name}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Modal
      isOpen={showReminder}
      onClose={() => setShowReminder(false)}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Medication Reminder</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="lg">It's time to take your medication:</Text>
          <Text fontSize="xl" fontWeight="bold">
            {medicationToTake?.name}
          </Text>
          <Text>Dosage: {medicationToTake?.dosage}</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleTakeMedication}>
            ✔ Take Medication
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MedicationReminder;
