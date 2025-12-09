const mongoose = require("mongoose");

const citizenIncidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  severity: { type: String, default: "LOW" },
  description: { type: String, required: true },
  
  // We allow both 'address' or 'location' to be safe
  address: { type: String, required: true },
  
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "Citizen" },
  status: { type: String, default: "ACTIVE" },
  
  // For Admin replies
   adminReplies: [{
    message: String,
    date: { type: Date, default: Date.now }
  }],
  adminNotes: [{
    note: String,
    date: { type: Date, default: Date.now }
  }]

}, { timestamps: true });

module.exports = mongoose.model("CitizenIncident", citizenIncidentSchema);