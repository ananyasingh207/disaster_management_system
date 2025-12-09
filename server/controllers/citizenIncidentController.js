const CitizenIncident = require("../models/CitizenIncident");

exports.createIncident = async (req, res) => {
  try {
    console.log("📝 Receiving Incident Report:", req.body);

    const { title, type, severity, description, address, location } = req.body;

    // Handle case where frontend sends 'location' instead of 'address'
    const finalAddress = address || location;

    if (!finalAddress) {
      return res.status(400).json({ message: "Location/Address is required" });
    }

    const incident = await CitizenIncident.create({
      title,
      type,
      severity,
      description,
      address: finalAddress,
      citizenId: req.user._id // Taken from the logged-in token
    });

    console.log("✅ Incident Saved:", incident._id);
    res.status(201).json(incident);

  } catch (err) {
    console.error("❌ Incident Creation Failed:", err);
    res.status(500).json({ message: "Server Error: Could not save report." });
  }
};

exports.getMyIncidents = async (req, res) => {
  try {
    const incidents = await CitizenIncident.find({ citizenId: req.user._id })
                                           .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ message: "Server Error fetching history" });
  }
};