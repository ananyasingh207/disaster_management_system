const CitizenAlert = require("../models/CitizenAlert");

/**
 * Fetch all active alerts for citizens.
 * Filters based on audience matching the user role or "ALL".
 */
exports.getCitizenAlerts = async (req, res) => {
  try {
    const userRole = req.role ? req.role.toUpperCase() : "CITIZEN";

    const query = {
      audience: { $in: ["ALL", userRole] }
    };

    const alerts = await CitizenAlert.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json(alerts);
  } catch (err) {
    console.error("CitizenAlert Error:", err);
    res.status(500).json({ message: "Failed to load alerts" });
  }
};
