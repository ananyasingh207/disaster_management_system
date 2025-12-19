const mongoose = require("mongoose");

// Schema for Citizen Alerts (Broadcasts)
const citizenAlertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },

    region: String,

    // Specific incident type (Flood, Fire, etc.)
    category: {
      type: String,
      default: "GENERAL"
    },

    // Target audience: "ALL" vs "CITIZEN"
    audience: {
      type: String,
      default: "ALL"
    },

    sourceType: {
      type: String,
      default: "ADMIN",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CitizenAlert", citizenAlertSchema);
