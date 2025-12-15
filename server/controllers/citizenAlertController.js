// const CitizenAlert = require("../models/CitizenAlert");

// exports.getCitizenAlerts = async (req, res) => {
//   try {
//     const alerts = await CitizenAlert.find({}).sort({ createdAt: -1 });

//     res.json(alerts);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// };


const CitizenAlert = require("../models/CitizenAlert");

/**
 * GET /api/citizen/alerts
 * Fetch ALL active alerts for citizens (HARD RESET - No Filtering)
 */
exports.getCitizenAlerts = async (req, res) => {
  try {
    // TEMPORARY RESET: Fetch all alerts directly
    const alerts = await CitizenAlert.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json(alerts);
  } catch (err) {
    console.error("CitizenAlert Error:", err);
    res.status(500).json({ message: "Failed to load alerts" });
  }
};
