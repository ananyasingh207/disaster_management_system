const mongoose = require("mongoose");

const volunteerAlertSchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },

    type: String,    // assignment, warning, mission-update
    message: String,

    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
    },

    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("VolunteerAlert", volunteerAlertSchema);
