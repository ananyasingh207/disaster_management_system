const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    skills: [{ type: String }],
    location: { type: String },
    
    // Status Fields
    status: { type: String, enum: ["AVAILABLE", "BUSY", "OFF_DUTY", "DEPLOYED"], default: "AVAILABLE" },
    approved: { type: Boolean, default: false },

    // 🔹 NEW TRAINING FIELDS 🔹
    trainingStatus: { 
      type: String, 
      enum: ["PENDING", "CERTIFIED"], 
      default: "PENDING" 
    },
    quizScore: { type: Number, default: 0 },

    role: { type: String, default: "volunteer" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);