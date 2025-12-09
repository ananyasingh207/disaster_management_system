require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Auth middleware
const {
  protect,
  protectAdmin,
  protectVolunteer,
  protectCitizen,
} = require("./middleware/auth");

// Routes
const citizenAuthRoutes = require("./routes/citizenAuthRoutes");
const citizenIncidentRoutes = require("./routes/citizenIncidentRoutes");
const citizenAlertRoutes = require("./routes/citizenAlertRoutes");

// Volunteer Routes
const volunteerAuthRoutes = require("./routes/volunteerAuthRoutes"); // 👈 NEW IMPORT
const volunteerRoutes = require("./routes/volunteerRoutes");
const volunteerAlertRoutes = require("./routes/volunteerAlertRoutes");

const missionRoutes = require("./routes/missionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const incidentNoteRoutes = require("./routes/incidentNoteRoutes");
const citizenOtpRoutes = require("./routes/citizenOtpRoutes");


// App
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
connectDB();

// ---------------- CITIZEN ROUTES ----------------
app.use("/api/citizen/auth", citizenAuthRoutes); 
app.use("/api/citizen/incidents", protect, protectCitizen, citizenIncidentRoutes);
app.use("/api/citizen/alerts", protect, protectCitizen, citizenAlertRoutes);
app.use("/api/citizen/otp", citizenOtpRoutes); 

// ---------------- VOLUNTEER ROUTES --------------
// 🔹 NEW: Public Auth Routes (Register/Login)
app.use("/api/volunteer/auth", volunteerAuthRoutes); 

// Protected Routes (Dashboard, Missions, etc.)
app.use("/api/volunteer", protect, protectVolunteer, volunteerRoutes);
app.use("/api/volunteer/alerts", protect, protectVolunteer, volunteerAlertRoutes);
app.use("/api/missions", protect, protectVolunteer, missionRoutes);
app.use("/api/reports", protect, protectVolunteer, reportRoutes);

// ---------------- ADMIN ROUTES ------------------
app.use("/api/admin", adminRoutes); 
app.use("/api/admin/notes", protect, protectAdmin, incidentNoteRoutes);

// Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));