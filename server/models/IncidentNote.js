const mongoose = require("mongoose");

// Schema for Incident Notes (Admin/Volunteer internal notes)
const IncidentNoteSchema = new mongoose.Schema(
  {
    // Reference to the incident
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "incidentModel", // CitizenIncident | Report | SOS
    },

    incidentModel: {
      type: String,
      required: true,
      enum: ["CitizenIncident", "Report", "SOS"],
    },

    // Note content
    note: {
      type: String,
      required: true,
      trim: true,
    },

    // Author of the note
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "authorModel",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["ADMIN", "VOLUNTEER", "CITIZEN", "SYSTEM"],
        required: true,
      },
    },

    authorModel: {
      type: String,
      enum: ["Admin", "Volunteer", "Citizen"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IncidentNote", IncidentNoteSchema);

