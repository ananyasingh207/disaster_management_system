const Mission = require("../models/Mission");

exports.getMissions = async (req, res) => {
  try {
    const missions = await Mission.find()
      .populate("assignedTeam")
      .populate("volunteer")
      .sort({ createdAt: -1 });

    res.json(missions);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate("assignedTeam")
      .populate("volunteer");

    res.json(mission);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.acceptMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      { status: "ACCEPTED", volunteer: req.user._id },
      { new: true }
    );
    res.json(mission);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeMission = async (req, res) => {
  try {
    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      { status: "COMPLETED" },
      { new: true }
    );
    res.json(mission);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
