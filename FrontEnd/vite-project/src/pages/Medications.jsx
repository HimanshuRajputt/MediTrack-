import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  HStack,
  Flex,
  Heading,
  Badge,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Divider,
  useColorModeValue,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon, CalendarIcon } from "@chakra-ui/icons";

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showReminder, setShowReminder] = useState(false);
  const [medicationToTake, setMedicationToTake] = useState(null);
  const [medicationToDelete, setMedicationToDelete] = useState(null);
  const [medicationToEdit, setMedicationToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for adding new medication
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    timesPerDay: 1,
    timeSlots: ["08:00"],
    startDate: "",
    endDate: "",
  });

  // State for editing medication
  const [editMedication, setEditMedication] = useState({
    name: "",
    dosage: "",
    timesPerDay: 1,
    timeSlots: ["08:00"],
    startDate: "",
    endDate: "",
  });

  // Modal for all reminders
  const {
    isOpen: isAllRemindersOpen,
    onOpen: onAllRemindersOpen,
    onClose: onAllRemindersClose,
  } = useDisclosure();

  // Modal for adding medication
  const {
    isOpen: isAddMedicationOpen,
    onOpen: onAddMedicationOpen,
    onClose: onAddMedicationClose,
  } = useDisclosure();

  // Modal for editing medication
  const {
    isOpen: isEditMedicationOpen,
    onOpen: onEditMedicationOpen,
    onClose: onEditMedicationClose,
  } = useDisclosure();

  // Alert dialog for delete confirmation
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose,
  } = useDisclosure();
  const cancelRef = useRef();

  // Toast notification
  const toast = useToast();

  // UI colors
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  useEffect(() => {
    fetchMedications();
  }, []);

  useEffect(() => {
    calculateReminders();
    checkMedicationStatus();
  }, [medications]);

  // Check if medications are past end date and update status
  const checkMedicationStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedMedications = medications.map((med) => {
      const endDate = new Date(med.endDate);
      endDate.setHours(0, 0, 0, 0);

      // Create a new object with updated status if end date has passed
      if (endDate < today && med.status !== "inactive") {
        return {
          ...med,
          status: "inactive",
        };
      }
      return med;
    });

    // If there are any status changes, update the medications in the backend
    const medicationsToUpdate = updatedMedications.filter(
      (med, index) => med.status !== medications[index].status
    );

    if (medicationsToUpdate.length > 0) {
      medicationsToUpdate.forEach(async (med) => {
        try {
          const token = localStorage.getItem("token");
          await axios.put(
            `https://medtrack-bbackend.onrender.com/medications/${med._id}`,
            { status: "inactive" },
            {
              headers: { token },
            }
          );
        } catch (error) {
          console.error("Error updating medication status:", error);
        }
      });

      // Update local state with the new statuses
      setMedications(updatedMedications);
    }
  };

  const fetchMedications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://medtrack-bbackend.onrender.com/medications`,
        {
          headers: { token },
        }
      );
      console.log(response.data)
      setMedications(response.data);
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch medications. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Calculate and set reminders
  const calculateReminders = () => {
    const now = new Date();
    let upcomingReminders = [];

    medications.forEach((med) => {
      // Only include active medications in reminders
      if (med.status !== "inactive") {
        med.timeSlots.forEach((time) => {
          // Parse time considering both 24-hour format and AM/PM format
          let hours, minutes;

          if (time.includes("AM") || time.includes("PM")) {
            const [timePart, ampm] = time.split(" ");
            [hours, minutes] = timePart.split(":").map(Number);

            if (ampm === "PM" && hours < 12) {
              hours += 12;
            } else if (ampm === "AM" && hours === 12) {
              hours = 0;
            }
          } else {
            [hours, minutes] = time.split(":").map(Number);
          }

          const reminderTime = new Date();
          reminderTime.setHours(hours, minutes, 0, 0);

          if (reminderTime > now) {
            upcomingReminders.push({
              time: reminderTime,
              name: med.name,
            });
          }
        });
      }
    });

    upcomingReminders.sort((a, b) => a.time - b.time);
    setReminders(upcomingReminders);

    if (upcomingReminders.length > 0) {
      const nextReminder = upcomingReminders[0];
      const timeDifference = nextReminder.time - now;

      setTimeout(() => {
        setShowReminder(true);
        setMedicationToTake(nextReminder);
      }, timeDifference);
    }
  };

  const handleTakeMedication = () => {
    setShowReminder(false);
    toast({
      title: "Medication Taken",
      description: "You have successfully taken your medication.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    calculateReminders(); // ✅ Recalculate reminders after taking medication
  };

  // ✅ Handle input changes for new medication
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication({
      ...newMedication,
      [name]: value,
    });
  };

  // ✅ Handle input changes for edit medication
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditMedication({
      ...editMedication,
      [name]: value,
    });
  };

  // ✅ Format time to AM/PM format
  const formatTimeToAMPM = (time) => {
    if (time.includes("AM") || time.includes("PM")) {
      return time;
    }

    const [hours, minutes] = time.split(":").map(Number);
    let period = "AM";
    let displayHours = hours;

    if (hours >= 12) {
      period = "PM";
      displayHours = hours === 12 ? 12 : hours - 12;
    } else if (hours === 0) {
      displayHours = 12;
    }

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // ✅ Handle time slot changes
  const handleTimeSlotChange = (index, value) => {
    const updatedTimeSlots = [...newMedication.timeSlots];
    updatedTimeSlots[index] = value;
    setNewMedication({
      ...newMedication,
      timeSlots: updatedTimeSlots,
    });
  };

  // ✅ Handle edit time slot changes
  const handleEditTimeSlotChange = (index, value) => {
    const updatedTimeSlots = [...editMedication.timeSlots];
    updatedTimeSlots[index] = value;
    setEditMedication({
      ...editMedication,
      timeSlots: updatedTimeSlots,
    });
  };

  // ✅ Add or remove time slots based on timesPerDay
  const handleTimesPerDayChange = (value) => {
    const timesPerDay = parseInt(value);
    let timeSlots = [...newMedication.timeSlots];

    if (timesPerDay > timeSlots.length) {
      // Add more time slots
      for (let i = timeSlots.length; i < timesPerDay; i++) {
        timeSlots.push("08:00");
      }
    } else if (timesPerDay < timeSlots.length) {
      // Remove excess time slots
      timeSlots = timeSlots.slice(0, timesPerDay);
    }

    setNewMedication({
      ...newMedication,
      timesPerDay,
      timeSlots,
    });
  };

  // ✅ Add or remove time slots based on timesPerDay for edit
  const handleEditTimesPerDayChange = (value) => {
    const timesPerDay = parseInt(value);
    let timeSlots = [...editMedication.timeSlots];

    if (timesPerDay > timeSlots.length) {
      // Add more time slots
      for (let i = timeSlots.length; i < timesPerDay; i++) {
        timeSlots.push("08:00");
      }
    } else if (timesPerDay < timeSlots.length) {
      // Remove excess time slots
      timeSlots = timeSlots.slice(0, timesPerDay);
    }

    setEditMedication({
      ...editMedication,
      timesPerDay,
      timeSlots,
    });
  };

  // ✅ Open edit medication modal and populate with medication data
  const handleOpenEditModal = (medication) => {
    setMedicationToEdit(medication);

    // Convert time slots back to 24-hour format for the input fields
    const convertedTimeSlots = medication.timeSlots.map((timeSlot) => {
      if (timeSlot.includes("AM") || timeSlot.includes("PM")) {
        const [timePart, period] = timeSlot.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        if (period === "PM" && hours < 12) {
          hours += 12;
        } else if (period === "AM" && hours === 12) {
          hours = 0;
        }

        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
      }
      return timeSlot;
    });

    setEditMedication({
      name: medication.name,
      dosage: medication.dosage,
      timesPerDay: medication.timesPerDay,
      timeSlots: convertedTimeSlots,
      startDate: medication.startDate.split("T")[0], // Format date for input
      endDate: medication.endDate.split("T")[0], // Format date for input
    });
    onEditMedicationOpen();
  };

  // ✅ Submit new medication
  const handleAddMedication = async () => {
    try {
      const token = localStorage.getItem("token");

      // Format time slots to AM/PM format
      const formattedTimeSlots = newMedication.timeSlots.map((time) =>
        formatTimeToAMPM(time)
      );

      const medicationData = {
        ...newMedication,
        timeSlots: formattedTimeSlots,
      };

      await axios.post(
        "https://medtrack-bbackend.onrender.com/medications",
        medicationData,
        {
          headers: { token },
        }
      );

      toast({
        title: "Medication Added",
        description: "Your medication has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form and close modal
      setNewMedication({
        name: "",
        dosage: "",
        timesPerDay: 1,
        timeSlots: ["08:00"],
        startDate: "",
        endDate: "",
      });
      onAddMedicationClose();

      // Fetch updated medications
      fetchMedications();
    } catch (error) {
      console.error("Error adding medication:", error);
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // ✅ Update existing medication
  const handleUpdateMedication = async () => {
    if (!medicationToEdit) return;

    try {
      const token = localStorage.getItem("token");

      // Format time slots to AM/PM format
      const formattedTimeSlots = editMedication.timeSlots.map((time) =>
        formatTimeToAMPM(time)
      );

      const medicationData = {
        ...editMedication,
        timeSlots: formattedTimeSlots,
      };

      await axios.put(
        `https://medtrack-bbackend.onrender.com/medications/${medicationToEdit._id}`,
        medicationData,
        {
          headers: { token },
        }
      );

      toast({
        title: "Medication Updated",
        description: "Your medication has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Close modal and fetch updated medications
      onEditMedicationClose();
      fetchMedications();
    } catch (error) {
      console.error("Error updating medication:", error);
      toast({
        title: "Error",
        description: "Failed to update medication. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setMedicationToEdit(null);
    }
  };

  // ✅ Handle delete medication
  const handleDeleteMedication = async () => {
    if (!medicationToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://medtrack-bbackend.onrender.com/medications/${medicationToDelete._id}`,
        {
          headers: { token },
        }
      );

      toast({
        title: "Medication Deleted",
        description: "Your medication has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Close the alert dialog and fetch updated medications
      onDeleteAlertClose();
      fetchMedications();
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        title: "Error",
        description: "Failed to delete medication. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setMedicationToDelete(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return "gray";
    switch (status.toLowerCase()) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "paused":
        return "orange";
      case "inactive":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <VStack spacing={6} p={5} align="stretch" width="100%">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 0 }}
      >
        <Heading size="lg" fontWeight="bold" mb={{ base: 4, md: 0 }}>
          Medications Management
        </Heading>

        <HStack
          spacing={4}
          flexDirection={{ base: "column", sm: "row" }} // stack buttons on small screens
          alignItems={{ base: "stretch", sm: "center" }}
          width={{ base: "100%", sm: "auto" }}
        >
          <Button
            colorScheme="blue"
            onClick={onAllRemindersOpen}
            leftIcon={<CalendarIcon />}
            variant="outline"
            size="md"
            width={{ base: "100%", sm: "auto" }}
          >
            View All Reminders
          </Button>
          <Button
            colorScheme="green"
            onClick={onAddMedicationOpen}
            leftIcon={<AddIcon />}
            size="md"
            width={{ base: "100%", sm: "auto" }}
          >
            Add Medication
          </Button>
        </HStack>
      </Flex>

      <Divider />

      {/* ✅ Medication List */}
      {isLoading ? (
        <Text textAlign="center" py={4}>
          Loading medications...
        </Text>
      ) : medications.length === 0 ? (
        <Box
          textAlign="center"
          py={10}
          borderWidth="1px"
          borderRadius="lg"
          borderStyle="dashed"
          borderColor={borderColor}
        >
          <Text fontSize="lg" color="gray.500">
            No medications available.
          </Text>
          <Button
            mt={4}
            colorScheme="green"
            size="sm"
            onClick={onAddMedicationOpen}
          >
            Add Your First Medication
          </Button>
        </Box>
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={4}
        >
          {medications.map((med) => (
            <GridItem key={med._id}>
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                borderColor={borderColor}
                bg={cardBg}
                boxShadow="sm"
                _hover={{ boxShadow: "md", bg: hoverBg }}
                transition="all 0.2s"
                height="100%"
              >
                <Flex justifyContent="space-between" alignItems="flex-start">
                  <VStack align="start" spacing={1}>
                    {/* <Text> {localStorage.getItem("role")==="admin"? `Patient: ${med.userId.name}` : ""} </Text>
                    <Text> {localStorage.getItem("role")==="admin"? `Patient ID: ${med.userId._id}` : ""} </Text>
                    <Divider width="80%" borderColor="blue.400" borderWidth="2px" /> */}
                    <Flex alignItems="center">
                      <Text fontSize="lg" fontWeight="bold" mr={2}>
                        {med.name}
                      </Text>
                      <Badge
                        colorScheme={getStatusColor(med.status)}
                        borderRadius="full"
                        px={2}
                      >
                        {med.status || "Active"}
                      </Badge>
                    </Flex>
                    <Text fontSize="md" color="gray.600">
                      Dosage: {med.dosage}
                    </Text>
                  </VStack>
                  <HStack>
                    <Button
                      colorScheme="blue"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(med)}
                      aria-label="Edit medication"
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMedicationToDelete(med);
                        onDeleteAlertOpen();
                      }}
                      aria-label="Delete medication"
                    >
                      <DeleteIcon />
                    </Button>
                  </HStack>
                </Flex>
                {/* <Text> {localStorage.getItem("role")==="admin"? `Patient: ${med.userId.name}` : ""} </Text>
                    <Text> {localStorage.getItem("role")==="admin"? `Patient ID: ${med.userId._id}` : ""} </Text>
                    <Divider width="80%" borderColor="blue.400" borderWidth="2px" /> */}
                <Divider my={3} />

                <Flex flexWrap="wrap" gap={4} mt={2}>
                  <Box minW="150px">
                    <Text fontSize="sm" color="gray.500">
                      Times Per Day
                    </Text>
                    <Text>{med.timesPerDay}</Text>
                  </Box>
                  <Box minW="150px">
                    <Text fontSize="sm" color="gray.500">
                      Time Slots
                    </Text>
                    <Text>{med.timeSlots?.join(", ")}</Text>
                  </Box>
                  <Box minW="150px">
                    <Text fontSize="sm" color="gray.500">
                      Duration
                    </Text>
                    <Text>
                      {formatDate(med.startDate)} to {formatDate(med.endDate)}
                    </Text>
                  </Box>
                </Flex>
                <br />
                <Divider width="80%" borderColor="blue.400" borderWidth="2px" />
                <Text>
                  {" "}
                  {localStorage.getItem("role") === "admin"
                    ? `Patient: ${med.userId.name}`
                    : ""}{" "}
                </Text>
                <Text>
                  {" "}
                  {localStorage.getItem("role") === "admin"
                    ? `Patient ID: ${med.userId._id}`
                    : ""}{" "}
                </Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      )}

      {/* ✅ Medication Reminder Popup */}
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
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleTakeMedication}>
              ✔ Take Medication
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ✅ Modal to Show All Reminders */}
      <Modal
        isOpen={isAllRemindersOpen}
        onClose={onAllRemindersClose}
        isCentered
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upcoming Reminders</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {reminders.length === 0 ? (
              <Text textAlign="center" py={4}>
                No upcoming reminders.
              </Text>
            ) : (
              reminders.map((reminder, index) => (
                <Box
                  key={index}
                  mt={2}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={borderColor}
                  bg={cardBg}
                  boxShadow="sm"
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontWeight="bold">{reminder.name}</Text>
                    <Badge colorScheme="blue" borderRadius="full">
                      Today
                    </Badge>
                  </Flex>
                  <Text mt={1}>
                    {reminder.time.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </Box>
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onAllRemindersClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ✅ New Modal for Adding Medication */}
      <Modal
        isOpen={isAddMedicationOpen}
        onClose={onAddMedicationClose}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Medication</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Medication Name</FormLabel>
                <Input
                  name="name"
                  value={newMedication.name}
                  onChange={handleInputChange}
                  placeholder="Enter medication name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Dosage</FormLabel>
                <Input
                  name="dosage"
                  value={newMedication.dosage}
                  onChange={handleInputChange}
                  placeholder="e.g., 10mg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Times Per Day</FormLabel>
                <NumberInput
                  min={1}
                  max={10}
                  value={newMedication.timesPerDay}
                  onChange={(valueString) =>
                    handleTimesPerDayChange(valueString)
                  }
                >
                  <NumberInputField name="timesPerDay" />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Time Slots</FormLabel>
                <Stack spacing={2}>
                  {newMedication.timeSlots.map((time, index) => (
                    <Input
                      key={index}
                      value={time}
                      onChange={(e) =>
                        handleTimeSlotChange(index, e.target.value)
                      }
                      type="time"
                      placeholder="e.g., 08:00"
                    />
                  ))}
                </Stack>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  name="startDate"
                  type="date"
                  value={newMedication.startDate}
                  onChange={handleInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  name="endDate"
                  type="date"
                  value={newMedication.endDate}
                  onChange={handleInputChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddMedicationClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddMedication}>
              Add Medication
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ✅ New Modal for Editing Medication */}
      <Modal
        isOpen={isEditMedicationOpen}
        onClose={onEditMedicationClose}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Medication</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Medication Name</FormLabel>
                <Input
                  name="name"
                  value={editMedication.name}
                  onChange={handleEditInputChange}
                  placeholder="Enter medication name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Dosage</FormLabel>
                <Input
                  name="dosage"
                  value={editMedication.dosage}
                  onChange={handleEditInputChange}
                  placeholder="e.g., 10mg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Times Per Day</FormLabel>
                <NumberInput
                  min={1}
                  max={10}
                  value={editMedication.timesPerDay}
                  onChange={(valueString) =>
                    handleEditTimesPerDayChange(valueString)
                  }
                >
                  <NumberInputField name="timesPerDay" />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Time Slots</FormLabel>
                <Stack spacing={2}>
                  {editMedication.timeSlots.map((time, index) => (
                    <Input
                      key={index}
                      value={time}
                      onChange={(e) =>
                        handleEditTimeSlotChange(index, e.target.value)
                      }
                      type="time"
                      placeholder="e.g., 08:00"
                    />
                  ))}
                </Stack>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  name="startDate"
                  type="date"
                  value={editMedication.startDate}
                  onChange={handleEditInputChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  name="endDate"
                  type="date"
                  value={editMedication.endDate}
                  onChange={handleEditInputChange}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditMedicationClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpdateMedication}>
              Update Medication
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ✅ New Alert Dialog for Delete Confirmation */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Medication
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {medicationToDelete?.name}? This
              action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteMedication} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default Medications;
