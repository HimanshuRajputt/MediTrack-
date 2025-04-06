// import mongoose from "mongoose";

// const medicationSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     name: { type: String, required: true },
//     dosage: { type: String, required: true },
//     frequency: { type: String, required: true }, // e.g., "Twice a day"
//     startDate: { type: Date, default: () => new Date() },
//     endDate: { type: Date },
//     status: { type: String, enum: ["active", "completed"], default: "active" },
//   },
//   { timestamps: true }
// );

// const Medication = mongoose.model("Medication", medicationSchema);
// export default Medication;

import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    dosage: { type: String, required: true },

    // ✅ Updated Frequency Fields
    timesPerDay: { type: Number, required: true }, // e.g., 2 times a day
    timeSlots: [{ type: String, required: true }], // e.g., ["08:00 AM", "08:00 PM"]

    startDate: { type: Date, default: () => new Date() },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

const Medication = mongoose.model("Medication", medicationSchema);
export default Medication;
