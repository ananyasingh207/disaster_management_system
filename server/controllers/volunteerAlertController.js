const VolunteerAlert = require("../models/VolunteerAlert");

// Get alerts for logged-in volunteer
exports.getVolunteerAlerts = async (req, res) => {
  try {
    const alerts = await VolunteerAlert.find({
      volunteer: req.user._id,
    })
      .populate("mission", "title status location createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(alerts);
  } catch (err) {
    console.error("Get Volunteer Alerts Error:", err);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};
