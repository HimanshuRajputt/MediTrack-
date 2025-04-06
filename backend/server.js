import express from "express"
import dotenv from "dotenv"
import ConnectDB from "./config/db.js"
import cors from "cors"
import  authRoutes  from "./routes/auth.routes.js";
import medicationRoutes from "./routes/medication.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import path from "path";
import { fileURLToPath } from "url";
// import "./cronJob.js"; 
// Import cron job to start it automatically


dotenv.config()
const Port= process.env.PORT || 5000

const app= express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(cors())

app.use("/auth", authRoutes);
app.use("/medications",medicationRoutes)
app.use("/prescriptions", prescriptionRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/",(req,res)=>{
    res.status(200).json({message: "healthy"})
})

app.listen( Port,()=>{
    ConnectDB()
    console.log(`Server Running on Port:${Port} `)
})