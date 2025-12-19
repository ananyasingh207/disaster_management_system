const mongoose = require("mongoose");

// Schema for Citizen Incidents/Reports
const citizenIncidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },

    sourceType: {
      type: String,
      default: "CITIZEN",
    },

    location: {
      lat: Number,
      lng: Number,
      address: String,
    },

    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
    },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "IN_PROGRESS", "COMPLETED", "RESOLVED"],
      default: "PENDING",
    },

    assignedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      default: null,
    },

    adminReplies: [
      {
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    adminNotes: [
      {
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CitizenIncident", citizenIncidentSchema);
