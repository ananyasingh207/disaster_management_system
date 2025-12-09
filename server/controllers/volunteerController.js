// --- START OF FILE server/controllers/volunteerController.js ---

const Volunteer = require("../models/Volunteer");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// ... existing imports
const CitizenAlert = require("../models/CitizenAlert");
const VolunteerAlert = require("../models/VolunteerAlert");
const Mission = require("../models/Mission");

// --- 1. SEND OTP ---
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if volunteer already exists
    const existing = await Volunteer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB (Upsert: Create new or Update existing)
    await Otp.findOneAndUpdate(
      { email },
      { otp: otpCode },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // --- SEND EMAIL LOGIC ---
    try {
      await sendEmail({
        email: email,
        subject: "Verify Your Volunteer Account",
        message: `Your OTP is: ${otpCode}`,
        otp: otpCode // Passing this for the HTML template
      });

      console.log(`✅ Email sent to ${email}`);
      res.json({ message: "OTP sent to your email!" });

    } catch (emailError) {
      console.error("❌ Email send failed:", emailError);
      
      // If email fails, remove the OTP from DB so user can try again immediately
      await Otp.deleteOne({ email });
      
      return res.status(500).json({ message: "Could not send email. Check internet or SMTP settings." });
    }
    // ------------------------

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to process OTP request" });
  }
};

// --- 2. REGISTER (Verify OTP and Create User) ---
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, skills, location, otp } = req.body;

    // A. Verify OTP
    const otpRecord = await Otp.findOne({ email });
    
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid or Expired OTP" });
    }

    // B. Check if user exists (Double check)
    const existing = await Volunteer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // C. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // D. Create Volunteer
    const volunteer = await Volunteer.create({
      name,
      email,
      phone,
      password: hashedPassword,
      skills,
      location,
      approved: false // Pending Admin Approval
    });

    // E. Delete used OTP
    await Otp.deleteOne({ email });

    res.status(201).json({ message: "Registration successful. Please wait for admin approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// --- 3. LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (volunteer.approved === false) {
      return res.status(403).json({ message: "Account pending admin approval." });
    }

    const token = jwt.sign(
      { id: volunteer._id, role: "volunteer" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, volunteer: { id: volunteer._id, name: volunteer.name } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- GET CURRENT PROFILE ---
exports.getVolunteerMe = async (req, res) => {
  res.json(req.user);
};

// --- UPDATE PROFILE ---
exports.updateVolunteer = async (req, res) => {
  try {
    const updated = await Volunteer.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    ).select("-password");
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// --- SUBMIT TRAINING RESULTS ---
exports.submitTraining = async (req, res) => {
  try {
    const { score } = req.body;
    
    // Logic: If score > 70%, mark as Certified
    const isPassed = score >= 70;
    
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      req.user._id, // Taken from the JWT Token
      { 
        quizScore: score,
        trainingStatus: isPassed ? "CERTIFIED" : "PENDING"
      },
      { new: true } // Return updated document
    ).select("-password");

    res.json({ 
      passed: isPassed,
      message: isPassed ? "Training Passed. You are now Field Certified." : "Score too low. Retake the simulation.",
      data: updatedVolunteer
    });

  } catch (err) {
    console.error("Training Error:", err);
    res.status(500).json({ message: "Failed to save training results." });
  }
};

// --- GET DASHBOARD DATA (Alerts + Active Missions) ---
exports.getDashboardData = async (req, res) => {
  try {
    // 1. Get Admin Broadcasts (Target: VOLUNTEER or ALL)
    // Note: In your DB you might be saving them in VolunteerAlert collection
    const adminAlerts = await VolunteerAlert.find().sort({ createdAt: -1 }).limit(5);

    // 2. Get Citizen Distress Signals (Recent)
    const citizenAlerts = await CitizenAlert.find({ status: "ACTIVE" }).sort({ createdAt: -1 }).limit(5);

    // 3. Get Missions assigned to THIS volunteer
    const myMissions = await Mission.find({ assignedTeam: req.user._id, status: "IN_PROGRESS" });

    res.json({
      adminAlerts,
      citizenAlerts,
      activeMissions: myMissions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- GET AVAILABLE MISSIONS ---
exports.getAvailableMissions = async (req, res) => {
  try {
    // Fetch:
    // 1. OPEN missions (Available to take)
    // 2. Missions assigned to ME (In Progress OR Completed)
    const missions = await Mission.find({
      $or: [
        { status: "OPEN" },
        { assignedTeam: req.user._id }
      ]
    }).sort({ 
      // Sort Critical first, then by newest
      severity: -1, 
      createdAt: -1 
    });
    
    res.json(missions);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- ACCEPT MISSION ---
exports.acceptMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ message: "Mission not found" });

    if (mission.status !== "OPEN") {
      return res.status(400).json({ message: "Mission already taken" });
    }

    mission.status = "IN_PROGRESS";
    mission.assignedTeam = req.user._id; // Assign to self
    await mission.save();

    res.json(mission);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.completeMission = async (req, res) => {
  try {
    const { status } = req.body; // Expect "IN_REVIEW" or "COMPLETED"
    const mission = await Mission.findById(req.params.id);
    
    if (!mission) return res.status(404).json({ message: "Mission not found" });

    // Verify ownership
    if (mission.assignedTeam.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 1. Update Mission Status
    // Default to COMPLETED if not provided, otherwise use IN_REVIEW
    mission.status = status || "COMPLETED";
    await mission.save();

    // 2. If Completed, free up the volunteer
    if (mission.status === "COMPLETED") {
      await Volunteer.findByIdAndUpdate(req.user._id, { status: "AVAILABLE" });
    }

    // 3. Notify Admin
    await VolunteerAlert.create({
      title: mission.status === "IN_REVIEW" ? "MISSION REPORT FILED" : "MISSION ACCOMPLISHED",
      message: `Agent ${req.user.name} has marked objective as: ${mission.status}`,
      type: "STATUS_UPDATE",
      severity: mission.status === "IN_REVIEW" ? "MEDIUM" : "SUCCESS",
      region: mission.location
    });

    res.json(mission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};