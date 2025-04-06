import express from "express";
import {
  addMedication,
  getMedications,
  updateMedication,
  deleteMedication,
} from "../controllers/medication.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const medicationRoutes = express.Router();

medicationRoutes.post("/", authMiddleware, addMedication); // ✅ Add Medication
medicationRoutes.get("/", authMiddleware, getMedications); // ✅ Get All Medications
medicationRoutes.put("/:id", authMiddleware, updateMedication); // ✅ Update Medication
medicationRoutes.delete("/:id", authMiddleware, deleteMedication); // ✅ Delete Medication

export default medicationRoutes;
