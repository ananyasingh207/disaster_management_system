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
 * Fetch active alerts for citizens
 */
exports.getCitizenAlerts = async (req, res) => {
  try {
    const now = new Date();

    // Auto-expire alerts if expiry time passed
    await CitizenAlert.updateMany(
      { expiresAt: { $lt: now }, status: "ACTIVE" },
      { status: "EXPIRED", active: false }
    );

    // Fetch only active alerts
    const alerts = await CitizenAlert.find({
      status: "ACTIVE",
      active: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(alerts);
  } catch (err) {
    console.error("CitizenAlert Error:", err);
    res.status(500).json({ message: "Failed to load alerts" });
  }
};
