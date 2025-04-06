import Medication from "../models/Medication.model.js";


export const addMedication = async (req, res) => {
  try {
    const { name, dosage, timesPerDay, timeSlots, startDate, endDate } =
      req.body;

    // Validate timeSlots length matches timesPerDay
    if (timeSlots.length !== timesPerDay) {
      return res.status(400).json({
        message: "The number of time slots must match timesPerDay.",
      });
    }

    const newMedication = new Medication({
      userId: req.user.userId,
      name,
      dosage,
      timesPerDay,
      timeSlots,
      startDate,
      endDate,
    });

    await newMedication.save();
    res.status(201).json({
      message: "Medication Added Successfully",
      medication: newMedication,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get All Medications for a User
export const getMedications = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      // const medications = await Medication.find();
      // res.status(200).json(medications);
      const medications = await Medication.find().populate("userId", "name");
      res.status(200).json(medications);
    } else {
      const medications = await Medication.find({ userId: req.user.userId });
      res.status(200).json(medications);
    }

    // const medications = await Medication.find({ userId: req.user.userId });
    // res.status(200).json(medications);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update Medication
export const updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMedication = await Medication.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedMedication)
      return res.status(404).json({ message: "Medication Not Found" });

    res
      .status(200)
      .json({ message: "Medication Updated", medication: updatedMedication });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete Medication
export const deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMedication = await Medication.findByIdAndDelete(id);

    if (!deletedMedication)
      return res.status(404).json({ message: "Medication Not Found" });

    res.status(200).json({ message: "Medication Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
