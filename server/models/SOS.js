const mongoose = require("mongoose");

// Schema for SOS signals
const sosSchema = new mongoose.Schema(
  {
    title: { type: String, default: "SOS Report" },

    sourceType: {
      type: String,
      default: "SOS",
    },

    severity: {
      type: String,
      enum: ["HIGH", "CRITICAL"],
      default: "HIGH",
    },

    location: {
      lat: Number,
      lng: Number,
      address: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACKNOWLEDGED", "CONVERTED"],
      default: "PENDING",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SOS", sosSchema);
