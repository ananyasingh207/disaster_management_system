const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");

// Send OTP to email
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
      subject: "Disaster Portal - Citizen Verification",
      message: `Your OTP is ${code}`,
      otp: code
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const code = req.body.otp || req.body.code;

    if (!email || !code)
      return res.status(400).json({ message: "Email and OTP are required" });

    // Find the OTP record
    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Compare OTP
    if (record.otp !== code.toString()) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // Delete OTP after successful verification
    await Otp.deleteOne({ email });

    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("verifyOtp error", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};