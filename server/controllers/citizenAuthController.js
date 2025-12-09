const Citizen = require("../models/Citizen");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- REGISTER ---
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, otp } = req.body;
    // (Add OTP verification logic here if needed, consistent with previous steps)

    // Check if exists
    let citizen = await Citizen.findOne({ email });
    if (citizen) return res.status(400).json({ message: "User already exists" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Citizen (Auto-Approved by default logic unless specified otherwise)
    citizen = new Citizen({
      name,
      email,
      password: hashedPassword,
      phone,
      isApproved: true // 🟢 Auto-Approve Citizens
    });

    await citizen.save();
    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const citizen = await Citizen.findOne({ email });
    if (!citizen) return res.status(400).json({ message: "Invalid credentials" });

    // Check Ban Status
    if (citizen.isApproved === false) {
      return res.status(403).json({ message: "Account has been suspended by Admin." });
    }

    const isMatch = await bcrypt.compare(password, citizen.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: citizen._id, role: "citizen" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: citizen._id, name: citizen.name } });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};