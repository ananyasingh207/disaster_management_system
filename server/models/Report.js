const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  missionId: { type: String },
  type: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
  status: { type: String, default: "PENDING" },
  
  // ✅ ADD THESE ARRAYS
  adminReplies: [{
    message: String,
    date: { type: Date, default: Date.now }
  }],
  adminNotes: [{
    note: String,
    date: { type: Date, default: Date.now }
  }],
  // -------------------

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);