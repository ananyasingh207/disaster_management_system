const Report = require("../models/Report");

// Create Report
exports.createReport = async (req, res) => {
  try {
    const { type, description, location, missionId } = req.body;

    if (!type || !description || !location) {
      return res.status(400).json({ message: "Type, description, and location are required" });
    }

    const report = await Report.create({
      mission: missionId || null,
      type,
      description,
      location,
      reportedBy: req.user._id,
      status: "PENDING",
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (err) {
    console.error("Create Report Error:", err);
    res.status(500).json({ message: "Failed to submit report" });
  }
};

// Get My Reports
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(reports);
  } catch (err) {
    console.error("Get My Reports Error:", err);
    res.status(500).json({ message: "Failed to fetch report history" });
  }
};