const Report = require("../models/Report");

// Create New Report
exports.createReport = async (req, res) => {
  try {
    const report = await Report.create({
      ...req.body,
      reportedBy: req.user._id // Taken from the logged-in token
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit report" });
  }
};

// Get History for Logged In User
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.user._id })
                                .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};