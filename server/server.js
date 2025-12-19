require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Auth Middleware
const {
  protect,
  protectAdmin,
  protectVolunteer,
  protectCitizen,
} = require("./middleware/auth");

// Route Handlers
const citizenAuthRoutes = require("./routes/citizenAuthRoutes");
const citizenIncidentRoutes = require("./routes/citizenIncidentRoutes");
const citizenAlertRoutes = require("./routes/citizenAlertRoutes");
const citizenOtpRoutes = require("./routes/citizenOtpRoutes");

const volunteerAuthRoutes = require("./routes/volunteerAuthRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const volunteerAlertRoutes = require("./routes/volunteerAlertRoutes");

const missionRoutes = require("./routes/missionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const incidentNoteRoutes = require("./routes/incidentNoteRoutes");
const sosRoutes = require("./routes/sosRoutes");

// Initialize Database Connection
connectDB();

// Initialize Express App
const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Citizen Routes
app.use("/api/citizen/auth", citizenAuthRoutes);
app.use("/api/citizen/incidents", protect, protectCitizen, citizenIncidentRoutes);
app.use("/api/citizen/alerts", protect, citizenAlertRoutes);
app.use("/api/citizen/otp", citizenOtpRoutes);

// Volunteer Routes
app.use("/api/volunteer/auth", volunteerAuthRoutes);

// Volunteer Protected Routes
app.use("/api/volunteer", protect, protectVolunteer, volunteerRoutes);
app.use("/api/volunteer/alerts", protect, protectVolunteer, volunteerAlertRoutes);
app.use("/api/missions", protect, protectVolunteer, missionRoutes);
app.use("/api/reports", protect, protectVolunteer, reportRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/notes", protect, protectAdmin, incidentNoteRoutes);

// Public Routes
app.use("/api/sos", sosRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));