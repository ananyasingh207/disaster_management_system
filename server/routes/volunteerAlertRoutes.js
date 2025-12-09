const express = require("express");
const router = express.Router();
const { register, login, sendOtp } = require("../controllers/volunteerController");

// Public Routes
router.post("/send-otp", sendOtp); 
router.post("/register", register);
router.post("/login", login);

module.exports = router;