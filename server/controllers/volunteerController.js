const Volunteer = require("../models/Volunteer");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const VolunteerAlert = require("../models/VolunteerAlert");
const Mission = require("../models/Mission");
const CitizenIncident = require("../models/CitizenIncident");
const CitizenAlert = require("../models/CitizenAlert");

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove old OTPs for this email
    await Otp.deleteMany({ email });

    // Save to DB
    await Otp.create({
      email,
      otp: code
    });

    // Send Email
    await sendEmail({
      email,
      subject: "Disaster Portal - Volunteer Verification",
      message: `Your OTP is ${code}`,
      otp: code
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Register (with OTP verification)
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, otp, skills, location } = req.body;

    if (!name || !email || !password || !phone || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Verify OTP
    const record = await Otp.findOne({ email });
    if (!record || record.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check Existing
    const existing = await Volunteer.findOne({
      $or: [{ email }, { phone }]
    });
    if (existing) {
      return res.status(400).json({ message: "Volunteer already registered" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Volunteer
    const volunteer = await Volunteer.create({
      name,
      email,
      phone,
      password: hashedPassword,
      skills: skills,
      location,
      approved: true,
      roleType: "VOLUNTEER"
    });

    // Delete OTP
    await Otp.deleteOne({ email });

    res.status(201).json({ message: "Volunteer registered successfully", volunteer });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) return res.status(400).json({ message: "Volunteer not found" });

    if (!volunteer.approved) return res.status(403).json({ message: "Account not approved" });

    const match = await bcrypt.compare(password, volunteer.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: volunteer._id, role: "volunteer" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: volunteer._id, name: volunteer.name, role: "volunteer" } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Profile
exports.getVolunteerMe = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.user._id).select("-password");
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Profile
exports.updateVolunteer = async (req, res) => {
  try {
    const updated = await Volunteer.findByIdAndUpdate(req.user._id, req.body, { new: true }).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const activeIncidents = [];

    // Assigned Ongoing Incidents
    const assignedIncidents = await CitizenIncident.find({
      assignedVolunteer: req.user._id,
      status: "IN_PROGRESS"
    })
      .sort({ createdAt: -1 })
      .lean();

    // Completed History
    const completedIncidents = await CitizenIncident.find({
      assignedVolunteer: req.user._id,
      status: "COMPLETED"
    })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({
      activeIncidents,
      assignedIncidents,
      completedIncidents
    });
  } catch (err) {
    console.error("Dashboard Data Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Available Missions (Legacy)
exports.getAvailableMissions = async (req, res) => {
  res.json([]);
};

// Accept Incident
exports.acceptIncident = async (req, res) => {
  try {
    const incident = await CitizenIncident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    if (incident.status !== "PENDING") {
      return res.status(400).json({ message: "Incident is not available used for self-deployment (Must be PENDING)" });
    }

    incident.status = "IN_PROGRESS";
    await incident.save();

    res.json({ message: "Incident Accepted", incident });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Single Incident
exports.getIncident = async (req, res) => {
  try {
    const incident = await CitizenIncident.findById(req.params.id).lean();
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json(incident);
  } catch (err) {
    console.error("Get Incident Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Resolve Incident
exports.resolveIncident = async (req, res) => {
  try {
    const incident = await CitizenIncident.findById(req.params.id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    const volunteerId = req.user._id;

    if (incident.assignedVolunteer?.toString() !== volunteerId.toString()) {
      return res.status(403).json({ message: "You are not assigned to this incident." });
    }

    if (incident.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message: `Cannot resolve. Incident is ${incident.status} (Must be IN_PROGRESS)`
      });
    }

    incident.status = "COMPLETED";
    await incident.save();

    // Reset Volunteer Status
    const volunteer = await Volunteer.findById(volunteerId);
    if (volunteer) {
      volunteer.status = "AVAILABLE";
      await volunteer.save();
    }

    res.json({ message: "Incident Resolved", incident });
  } catch (err) {
    console.error("Resolve Incident Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Complete Mission (Legacy)
exports.completeMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission || mission.volunteer.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    mission.status = "COMPLETED";
    await mission.save();

    await Volunteer.findByIdAndUpdate(req.user._id, { status: "AVAILABLE" });

    res.json(mission);
  } catch (err) {
    console.error("Complete Mission Error:", err);
    res.status(500).json({ message: "Failed to complete mission" });
  }
};

// Submit Training Results
exports.submitTraining = async (req, res) => {
  try {
    const { quizScore } = req.body;
    const volunteer = await Volunteer.findById(req.user._id);
    volunteer.quizScore = quizScore;
    volunteer.trainingStatus = quizScore >= 80 ? "CERTIFIED" : "PENDING";
    await volunteer.save();
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};