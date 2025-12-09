const mongoose = require("mongoose");

const citizenAlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: "WEATHER" }, // WEATHER, REGION_WARNING, etc.
  region: { type: String }, // Coordinates or City Name
  severity: { type: String, default: "LOW" }, // LOW, MEDIUM, HIGH, CRITICAL
  status: { type: String, default: "ACTIVE" }, // ACTIVE, EXPIRED
}, { timestamps: true });


module.exports = mongoose.model("CitizenAlert", citizenAlertSchema);