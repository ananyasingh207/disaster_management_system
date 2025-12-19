const Citizen = require("../models/Citizen");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new Citizen
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Citizen.findOne({
      $or: [{ email }, { phone }]
    });

    if (existing) {
      return res.status(400).json({ message: "Citizen already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const citizen = await Citizen.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isApproved: true
    });

    res.status(201).json({
      message: "Registration successful",
      citizen: {
        id: citizen._id,
        name: citizen.name,
        email: citizen.email
      }
    });

  } catch (err) {
    console.error("Citizen Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Citizen Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const citizen = await Citizen.findOne({ email });
    if (!citizen) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (citizen.isApproved === false) {
      return res.status(403).json({
        message: "Account suspended by admin"
      });
    }

    const isMatch = await bcrypt.compare(password, citizen.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: citizen._id,
        role: "citizen"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: citizen._id,
        name: citizen.name,
        role: "citizen"
      }
    });

  } catch (err) {
    console.error("Citizen Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
