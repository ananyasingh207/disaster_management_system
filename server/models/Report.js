const mongoose = require("mongoose");

// Schema for Field Reports submitted by Volunteers
const reportSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Field Report" },
    description: { type: String, required: true },

    sourceType: {
      type: String,
      default: "VOLUNTEER",
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    location: {
      lat: Number,
      lng: Number,
      address: String,
    },

    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "COMPLETED"],
      default: "PENDING",
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

module.exports = mongoose.model("Report", reportSchema);
