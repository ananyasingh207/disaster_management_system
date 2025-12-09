const CitizenAlert = require("../models/CitizenAlert");

exports.getCitizenAlerts = async (req, res) => {
  try {
    const alerts = await CitizenAlert.find({}).sort({ createdAt: -1 });

    res.json(alerts);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
