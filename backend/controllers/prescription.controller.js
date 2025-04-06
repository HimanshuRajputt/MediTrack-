import Prescription from "../models/Prescription.model.js";
import fs from "fs";
import path from "path";

// ✅ Upload Prescription (Multer Saves File, URL Stored in MongoDB)
export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "File upload failed" });

    const newPrescription = new Prescription({
      userId: req.user.userId,
      fileUrl: `/uploads/${req.file.filename}`, // Local file path (Can be changed to Cloud URL)
      fileName: req.file.originalname,
    });

    await newPrescription.save();
    res
      .status(201)
      .json({
        message: "Prescription uploaded successfully",
        prescription: newPrescription,
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get User Prescriptions
export const getPrescriptions = async (req, res) => {
  try {
    if(req.user.role==="admin"){
      const prescriptions = await Prescription.find().populate("userId", "name")
      res.status(200).json(prescriptions);
    }
      else{
        const prescriptions = await Prescription.find({ userId: req.user.userId });
        res.status(200).json(prescriptions);
      }
    

    
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Approve Prescription (Admin Only)
export const approvePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });

    res.status(200).json({ message: "Prescription approved", prescription });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Reject Prescription (Admin Only)
export const rejectPrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });

    res.status(200).json({ message: "Prescription rejected", prescription });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
