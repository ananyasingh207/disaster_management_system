const jwt = require("jsonwebtoken");
const Volunteer = require("../models/Volunteer");
const Citizen = require("../models/Citizen");
const Mission = require("../models/Mission");
const Team = require("../models/Team");
const CitizenAlert = require("../models/CitizenAlert");
const VolunteerAlert = require("../models/VolunteerAlert");
const CitizenIncident = require("../models/CitizenIncident");
const Report = require("../models/Report");

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body || {};
  if (email !== "admin@gmail.com" || password !== "Admin123") {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
  const token = jwt.sign({ id: "admin-fixed-id", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ message: "Admin login successful", token });
};

// Get All Users (Volunteers + Citizens)
exports.getAllUsers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().select("-password").lean();
    const citizens = await Citizen.find().select("-password").lean();
    const vList = volunteers.map(v => ({ ...v, roleType: 'VOLUNTEER' }));
    const cList = citizens.map(c => ({ ...c, roleType: 'CITIZEN' }));
    res.json([...vList, ...cList]);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Alerts and Reports Feed
exports.getAlerts = async (req, res) => {
  try {
    const { type } = req.query;

    // 1. Admin Broadcasts Only
    if (type === "BROADCAST") {
      const broadcasts = await CitizenAlert.find({
        sourceType: "ADMIN"
      }).sort({ createdAt: -1 }).lean();

      return res.json(broadcasts.map(b => ({
        ...b,
        typeTag: 'BROADCAST',
        audience: b.audience || "ALL"
      })));
    }

    // 2. Citizen Incidents Only
    if (type === "CITIZEN_INCIDENT") {
      const incidents = await CitizenIncident.find({
        status: { $ne: "RESOLVED" }
      })
        .sort({ createdAt: -1 })
        .populate("citizen", "name phone")
        .lean();

      return res.json(incidents.map(i => ({
        ...i,
        typeTag: 'INCIDENT',
        source: "Citizen Report"
      })));
    }

    // 3. Volunteer Reports Only
    if (type === "VOLUNTEER_REPORT") {
      const reports = await Report.find({})
        .populate("reportedBy", "name")
        .sort({ createdAt: -1 })
        .lean();

      return res.json(reports.map(r => ({
        ...r,
        typeTag: 'REPORT',
        source: r.reportedBy ? `Vol. ${r.reportedBy.name}` : "Volunteer"
      })));
    }

    // Legacy Fallback (Global Feed)
    const citizenAlerts = await CitizenAlert.find({ sourceType: "ADMIN" }).lean();
    const volunteerAlerts = await VolunteerAlert.find().lean();
    const citizenIncidents = await CitizenIncident.find({ status: { $ne: "RESOLVED" } }).sort({ createdAt: -1 }).lean();
    const volunteerReports = await Report.find().populate("reportedBy", "name").lean();

    const cBroadcasts = citizenAlerts.map(a => ({ ...a, typeTag: 'BROADCAST', severity: a.severity || 'INFO' }));
    const vBroadcasts = volunteerAlerts.map(a => ({ ...a, typeTag: 'BROADCAST', severity: a.severity || 'INFO' }));
    const incidents = citizenIncidents.map(i => ({ ...i, typeTag: 'INCIDENT', severity: i.severity }));
    const reports = volunteerReports.map(r => ({ ...r, typeTag: 'REPORT', severity: 'INFO', author: r.reportedBy?.name }));

    const feed = [...cBroadcasts, ...vBroadcasts, ...incidents, ...reports]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(feed);
  } catch (err) {
    console.error("Get Alerts Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Citizen.findById(id) || await Volunteer.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Toggle Citizen Approval Status
exports.toggleCitizenStatus = async (req, res) => {
  try {
    const citizen = await Citizen.findById(req.params.id);
    if (!citizen) return res.status(404).json({ message: "Citizen not found" });
    citizen.isApproved = !citizen.isApproved;
    await citizen.save();
    res.json(citizen);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Volunteers
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().select("-password").lean();
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Toggle Volunteer Approval Status
exports.toggleVolunteerStatus = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
    volunteer.approved = !volunteer.approved;
    await volunteer.save();
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Create Citizen Alert (Broadcast)
exports.createCitizenAlert = async (req, res) => {
  try {
    const alertData = {
      ...req.body,
      sourceType: "ADMIN",
      status: "ACTIVE",
      type: req.body.type || "BROADCAST"
    };

    const alert = await CitizenAlert.create(alertData);
    res.json(alert);
  } catch (err) {
    console.error("Broadcast Creation Failed:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create Volunteer Alert
exports.createVolunteerAlert = async (req, res) => {
  try {
    const alert = await VolunteerAlert.create(req.body);
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Incident by ID
exports.getIncidentById = async (req, res) => {
  try {
    const incident = await CitizenIncident.findById(req.params.id)
      .populate("citizen", "name phone")
      .lean();
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Acknowledge Incident
exports.acknowledgeIncident = async (req, res) => {
  try {
    const incident = await CitizenIncident.findByIdAndUpdate(
      req.body.id,
      { status: "ACKNOWLEDGED" },
      { new: true }
    );
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Send Reply to Citizen
exports.sendCitizenReply = async (req, res) => {
  try {
    const { id, message } = req.body;
    const incident = await CitizenIncident.findById(id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    incident.adminReplies.push({ message });
    await incident.save();
    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add Internal Admin Note
exports.addAdminRecord = async (req, res) => {
  try {
    const { id, note } = req.body;
    const incident = await CitizenIncident.findById(id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    incident.adminNotes.push({ note });
    await incident.save();
    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Deploy Rescue Team (Assign Volunteer)
exports.deployMission = async (req, res) => {
  try {
    const id = req.body.sourceId || req.body.id || req.body._id;
    const { volunteerId } = req.body;

    if (!volunteerId) {
      return res.status(400).json({ message: "Volunteer ID is required." });
    }

    const incident = await CitizenIncident.findById(id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    if (incident.status !== "PENDING") {
      return res.status(400).json({
        message: `Cannot assign. Incident is ${incident.status} (Must be PENDING)`
      });
    }

    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    if (volunteer.status !== "AVAILABLE") {
      return res.status(400).json({
        message: `Volunteer is currently ${volunteer.status}. Cannot assign.`
      });
    }

    // Assign Volunteer
    incident.assignedVolunteer = volunteerId;
    incident.status = "IN_PROGRESS";
    await incident.save();

    // Update Volunteer Status
    volunteer.status = "DEPLOYED";
    await volunteer.save();

    res.json({ message: "Volunteer Assigned Successfully", incident });
  } catch (err) {
    console.error("Assignment Error:", err);
    res.status(500).json({ message: "Assignment Failed" });
  }
};

// Resolve Incident
exports.resolveIncident = async (req, res) => {
  try {
    const { id } = req.body;

    const incident = await CitizenIncident.findById(id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    if (["COMPLETED", "RESOLVED"].includes(incident.status)) {
      return res.status(400).json({ message: "Incident is already resolved." });
    }

    incident.status = "COMPLETED";
    await incident.save();

    // Release Assigned Volunteer
    if (incident.assignedVolunteer) {
      const volunteer = await Volunteer.findById(incident.assignedVolunteer);
      if (volunteer) {
        volunteer.status = "AVAILABLE";
        await volunteer.save();
      }
    }

    res.json({ message: "Incident Resolved", incident });
  } catch (err) {
    console.error("Resolve Error:", err);
    res.status(500).json({ message: "Resolution Failed" });
  }
};

// Get All Missions (Legacy: using Incidents)
exports.getAllMissions = async (req, res) => {
  try {
    const missions = await CitizenIncident.find({ status: "IN_PROGRESS" })
      .populate("assignedVolunteer", "name phone")
      .sort({ createdAt: -1 });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Finalize Mission (Deprecated)
exports.finalizeMission = async (req, res) => {
  res.json({ message: "Use resolve endpoint" });
};

// Get All Teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("members leader");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Assign Team to Mission
exports.assignTeam = async (req, res) => {
  try {
    const { teamId } = req.body;
    const mission = await Mission.findByIdAndUpdate(
      req.params.id,
      { assignedTeam: teamId, status: "IN_PROGRESS" },
      { new: true }
    );
    if (!mission) return res.status(404).json({ message: "Mission not found" });
    res.json(mission);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Humanitarian Relief Requests
exports.getReliefRequests = async (req, res) => {
  try {
    const requests = await CitizenIncident.find({
      type: "HUMANITARIAN",
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Alert Status
exports.updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const alert = await CitizenAlert.findById(id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });

    alert.status = status;
    await alert.save();

    res.json(alert);
  } catch (err) {
    console.error("Alert Update Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Citizens List
exports.getCitizens = async (req, res) => {
  try {
    const citizens = await Citizen.find().select("-password");
    res.json(citizens);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Volunteer Approval
exports.updateVolunteerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({ message: "Invalid status" });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      id,
      { approved },
      { new: true, runValidators: true }
    );

    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    res.json({ success: true, volunteer });
  } catch (err) {
    console.error("Volunteer Update Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};