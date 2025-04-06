import express from "express";
import {
  uploadPrescription,
  getPrescriptions,
  approvePrescription,
  rejectPrescription,
} from "../controllers/prescription.controller.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const prescriptionRoutes = express.Router();

// ✅ Upload Prescription with File
prescriptionRoutes.post(
  "/",
  authMiddleware,
  upload.single("file"),
  uploadPrescription
);

// ✅ Get All Prescriptions
prescriptionRoutes.get("/", authMiddleware, getPrescriptions);

// ✅ Approve Prescription (Admin Only)
prescriptionRoutes.put(
  "/:id/approve",
  authMiddleware,
  adminMiddleware,
  approvePrescription
);

// ✅ Reject Prescription (Admin Only)
prescriptionRoutes.put(
  "/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectPrescription
);

export default prescriptionRoutes;
