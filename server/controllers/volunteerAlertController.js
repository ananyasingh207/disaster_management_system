const VolunteerAlert = require("../models/VolunteerAlert");

exports.getVolunteerAlerts = async (req, res) => {
  try {
    const alerts = await VolunteerAlert.find({
      volunteer: req.user._id,
    })
      .populate("mission")
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
