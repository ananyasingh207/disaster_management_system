const mongoose = require("mongoose");

const IncidentNoteSchema = new mongoose.Schema(
  {
    incidentId: String,
    content: String,
    author: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("IncidentNote", IncidentNoteSchema);
