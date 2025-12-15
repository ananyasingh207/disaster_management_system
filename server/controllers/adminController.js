// const jwt = require("jsonwebtoken");
// const Volunteer = require("../models/Volunteer");
// const Citizen = require("../models/Citizen");
// const Mission = require("../models/Mission");
// const Team = require("../models/Team");
// const CitizenAlert = require("../models/CitizenAlert");
// const VolunteerAlert = require("../models/VolunteerAlert");
// const IncidentNote = require("../models/IncidentNote");
// const CitizenIncident = require("../models/CitizenIncident");
// const Report = require("../models/Report");

// // --- ADMIN LOGIN ---
// exports.adminLogin = async (req, res) => {
//   const { email, password } = req.body || {};
//   if (email !== "admin@gmail.com" || password !== "Admin123") {
//     return res.status(401).json({ message: "Invalid admin credentials" });
//   }
//   const token = jwt.sign({ id: "admin-fixed-id", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
//   res.json({ message: "Admin login successful", token });
// };

// // --- GET ALL USERS (Volunteers + Citizens) ---
// exports.getAllUsers = async (req, res) => {
//   try {
//     const volunteers = await Volunteer.find().select("-password").lean();
//     const citizens = await Citizen.find().select("-password").lean();
//     const vList = volunteers.map(v => ({ ...v, roleType: 'VOLUNTEER' }));
//     const cList = citizens.map(c => ({ ...c, roleType: 'CITIZEN' }));
//     res.json([...vList, ...cList]);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // --- GET LIVE FEED (Alerts + Reports) ---
// exports.getAlerts = async (req, res) => {
//   try {
//     const citizenAlerts = await CitizenAlert.find().lean();
//     const volunteerAlerts = await VolunteerAlert.find().lean();
//     const citizenIncidents = await CitizenIncident.find().sort({ createdAt: -1 }).lean();
//     const volunteerReports = await Report.find().populate("reportedBy", "name").lean();

//     const cBroadcasts = citizenAlerts.map(a => ({ ...a, typeTag: 'BROADCAST', severity: a.severity || 'INFO' }));
//     const vBroadcasts = volunteerAlerts.map(a => ({ ...a, typeTag: 'BROADCAST', severity: a.severity || 'INFO' }));

//     const cReports = citizenIncidents.map(i => ({
//       _id: i._id, title: i.title, message: i.description, region: i.address, severity: i.severity, status: i.status, createdAt: i.createdAt, typeTag: 'CITIZEN', source: "Citizen Report"
//     }));

//     const vReports = volunteerReports.map(r => ({
//       _id: r._id, title: r.type + " UPDATE", message: r.description, region: r.location, severity: "MEDIUM", status: r.status, createdAt: r.createdAt, typeTag: 'VOLUNTEER', source: r.reportedBy ? `Vol. ${r.reportedBy.name}` : "Volunteer"
//     }));

//     const combined = [...cBroadcasts, ...vBroadcasts, ...cReports, ...vReports]
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     res.json(combined);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // --- GET INCIDENT DETAILS (Single View) ---
// exports.getIncidentById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // 1. Citizen Incidents
//     let incident = await CitizenIncident.findById(id).populate("citizenId", "name phone email").lean();

//     // 2. Volunteer Reports
//     if (!incident) {
//       incident = await Report.findById(id).populate("reportedBy", "name phone email").lean();
//     }

//     // 3. Check Alerts (Broadcasts)
//     if (!incident) {
//       incident = await CitizenAlert.findById(id).lean();
//     }

//     if (!incident) return res.status(404).json({ message: "Incident not found." });
//     res.json(incident);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // --- ACKNOWLEDGE / COMPLETE REPORT ---
// exports.acknowledgeIncident = async (req, res) => {
//   try {
//     const { sourceId } = req.body;

//     // Update status to 'COMPLETED' so it gets removed from the Pending list
//     const updateData = { status: "COMPLETED" };

//     let updated = await Report.findByIdAndUpdate(sourceId, updateData, { new: true });

//     if (!updated) {
//       updated = await CitizenIncident.findByIdAndUpdate(sourceId, updateData, { new: true });
//     }

//     if (!updated) {
//       return res.status(404).json({ message: "Incident not found" });
//     }

//     res.json({ message: "Mission Completed", incident: updated });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Update Failed" });
//   }
// };

// // --- DEPLOY MISSION ---
// exports.deployMission = async (req, res) => {
//   try {
//     const { sourceId, teamId, priority, title, description, location, type } = req.body;

//     let incident = await CitizenIncident.findById(sourceId);
//     if (!incident) incident = await CitizenAlert.findById(sourceId);

//     const missionData = {
//       title: title || incident?.title || "Emergency Mission",
//       description: description || incident?.description || incident?.message || "No description",
//       type: type || incident?.type || "EMERGENCY",
//       severity: priority || incident?.severity || "HIGH",
//       location: location || incident?.address || incident?.region || "Unknown",
//       status: "IN_PROGRESS",
//       assignedTeam: teamId || null,
//       sourceIncidentId: sourceId
//     };

//     const newMission = await Mission.create(missionData);

//     if (incident) {
//       incident.status = "MISSION_CREATED";
//       await incident.save();
//     }

//     if (teamId) {
//       await Volunteer.findByIdAndUpdate(teamId, { status: "IN_PROGRESS" });
//     }

//     res.json({ message: "Deployed", mission: newMission });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Deployment Failed" });
//   }
// };

// // --- MISSION & TEAM HELPERS ---
// exports.getAllMissions = async (req, res) => { const m = await Mission.find(); res.json(m); };
// exports.getTeams = async (req, res) => { const t = await Team.find(); res.json(t); };
// exports.getVolunteers = async (req, res) => { const v = await Volunteer.find(); res.json(v); };

// exports.assignTeam = async (req, res) => {
//   try {
//     const mission = await Mission.findByIdAndUpdate(req.params.id, { assignedTeam: req.body.teamId, status: "IN_PROGRESS" }, { new: true });
//     await Volunteer.findByIdAndUpdate(req.body.teamId, { status: "IN_PROGRESS" });
//     res.json(mission);
//   } catch { res.status(500).json({ message: "Error" }); }
// };

// // --- USER ACTIONS ---
// exports.toggleVolunteerStatus = async (req, res) => {
//   try {
//     const volunteer = await Volunteer.findById(req.params.id);

//     if (!volunteer) {
//       return res.status(404).json({ message: "Volunteer not found" });
//     }

//     volunteer.approved = !volunteer.approved;

//     await volunteer.save();

//     res.json({ 
//       message: volunteer.approved ? "Volunteer Approved" : "Volunteer Suspended",
//       status: volunteer.approved
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// exports.toggleCitizenStatus = async (req, res) => {
//   const c = await Citizen.findById(req.params.id);
//   if(c) { c.isApproved = !c.isApproved; await c.save(); res.json({message:"Updated"}); }
//   else res.status(404).json({message:"Not Found"});
// };

// exports.deleteUser = async (req, res) => {
//   let d = await Volunteer.findByIdAndDelete(req.params.id);
//   if(!d) d = await Citizen.findByIdAndDelete(req.params.id);
//   res.json({ message: d ? "Deleted" : "Not Found" });
// };

// // --- ALERTS CREATION ---
// exports.createCitizenAlert = async (req, res) => { const a = await CitizenAlert.create(req.body); res.json(a); };
// exports.createVolunteerAlert = async (req, res) => { const a = await VolunteerAlert.create(req.body); res.json(a); };

// // --- RELIEF OPS ---
// exports.getReliefRequests = async (req, res) => {
//   try {
//     const appeals = await CitizenIncident.find({ type: "HUMANITARIAN" }).sort({ createdAt: -1 });
//     res.json(appeals);
//   } catch { res.status(500).json({ message: "Error" }); }
// };

// // --- NOTES & LOGS ---
// exports.addIncidentNote = async (req, res) => {
//   const n = await IncidentNote.create({ incidentId: req.params.id, content: req.body.content, author: "Admin" });
//   res.json(n);
// };
// exports.getIncidentNotes = async (req, res) => {
//   const n = await IncidentNote.find({ incidentId: req.params.id });
//   res.json(n);
// };

// // --- SEND PUBLIC REPLY (With Debugging) ---
// exports.sendCitizenReply = async (req, res) => {
//   try {
//     console.log("📨 Received Reply Request:", req.body);
//     const { id, message } = req.body;
//     if (!id || !message) return res.status(400).json({ message: "ID/Msg missing" });

//     // 1. Try Citizen Incident
//     let updated = await CitizenIncident.findByIdAndUpdate(id, { $push: { adminReplies: { message } } }, { new: true });

//     // 2. Try Volunteer Report
//     if (!updated) {
//       updated = await Report.findByIdAndUpdate(id, { $push: { adminReplies: { message } } }, { new: true });
//     }

//     if (!updated) {
//       console.log("❌ Document Not Found");
//       return res.status(404).json({ message: "Incident not found" });
//     }

//     console.log("✅ Reply Saved");
//     res.json({ message: "Reply Sent" });
//   } catch (err) {
//     console.error("🔥 SERVER ERROR:", err);
//     res.status(500).json({ message: "Failed" });
//   }
// };

// // --- SAVE INTERNAL LOG (With Debugging) ---
// exports.addAdminRecord = async (req, res) => {
//   try {
//     const { id, note } = req.body;

//     // 1. Try Citizen Incident
//     let updated = await CitizenIncident.findByIdAndUpdate(id, { $push: { adminNotes: { note } } }, { new: true });

//     // 2. Try Volunteer Report
//     if (!updated) {
//       updated = await Report.findByIdAndUpdate(id, { $push: { adminNotes: { note } } }, { new: true });
//     }

//     if (!updated) return res.status(404).json({ message: "Incident not found" });

//     res.json({ message: "Internal Note Saved" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to save record" });
//   }
// };

// // --- ADMIN: FINALIZE MISSION ---
// exports.finalizeMission = async (req, res) => {
//   try {
//     const { id, decision } = req.body; // decision: "APPROVE" or "REJECT"

//     // Find the Mission (or Incident converted to mission)
//     // We check Mission collection first as deployment creates a Mission document
//     let mission = await Mission.findById(id); 

//     // Fallback: If your system uses Incident ID for routing, find mission by sourceIncidentId
//     if (!mission) {
//        mission = await Mission.findOne({ sourceIncidentId: id });
//     }

//     if (!mission) return res.status(404).json({ message: "Mission not found" });

//     if (decision === "APPROVE") {
//       // 1. Mark Mission Completed
//       mission.status = "COMPLETED";

//       // 2. Free up the Volunteer
//       if (mission.assignedTeam) {
//         await Volunteer.findByIdAndUpdate(mission.assignedTeam, { status: "AVAILABLE" });
//       }
//     } else {
//       // REJECT: Send back to volunteer
//       mission.status = "IN_PROGRESS";
//     }

//     await mission.save();
//     res.json({ message: `Mission ${decision === "APPROVE" ? "Completed" : "Returned to Queue"}` });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

const jwt = require("jsonwebtoken");
const Volunteer = require("../models/Volunteer");
const Citizen = require("../models/Citizen");
const Mission = require("../models/Mission");
const Team = require("../models/Team");
const CitizenAlert = require("../models/CitizenAlert");
const VolunteerAlert = require("../models/VolunteerAlert");
const CitizenIncident = require("../models/CitizenIncident");
const Report = require("../models/Report");

// --- ADMIN LOGIN ---
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body || {};
  if (email !== "admin@gmail.com" || password !== "Admin123") {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
  const token = jwt.sign({ id: "admin-fixed-id", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ message: "Admin login successful", token });
};

// --- GET ALL USERS (Volunteers + Citizens) ---
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

// --- GET LIVE FEED (Alerts + Reports) ---
// --- GET LIVE FEED (Alerts + Reports) ---
// --- GET LIVE FEED (Alerts + Reports) ---
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
      const incidents = await CitizenIncident.find({})
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

    // --- LEGACY FALLBACK (Global Feed) ---
    // Kept for dashboards that might still request without type
    const citizenAlerts = await CitizenAlert.find({ sourceType: "ADMIN" }).lean();
    const volunteerAlerts = await VolunteerAlert.find().lean();
    const citizenIncidents = await CitizenIncident.find().sort({ createdAt: -1 }).lean();
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

// --- USER MANAGEMENT ---
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

exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().select("-password").lean();
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

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

// --- ALERTS ---
exports.createCitizenAlert = async (req, res) => {
  try {
    const alertData = {
      ...req.body,
      // Enforce Admin Defaults
      sourceType: "ADMIN",
      status: "ACTIVE",
      // Ensure type is BROADCAST if not set (though frontend should send it)
      type: req.body.type || "BROADCAST"
    };

    const alert = await CitizenAlert.create(alertData);
    res.json(alert);
  } catch (err) {
    console.error("❌ Broadcast Creation Failed:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createVolunteerAlert = async (req, res) => {
  try {
    const alert = await VolunteerAlert.create(req.body);
    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- INCIDENTS ---
exports.getIncidentById = async (req, res) => {
  try {
    const incident = await CitizenIncident.findById(req.params.id)
      .populate("citizen", "name phone") // Updated ref to 'citizen' from schema
      .lean();
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

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

// --- MISSIONS ---
exports.deployMission = async (req, res) => {
  try {
    const mission = await Mission.create(req.body);
    res.json(mission);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllMissions = async (req, res) => {
  try {
    const missions = await Mission.find()
      .populate("assignedTeam volunteer")
      .sort({ createdAt: -1 });
    res.json(missions);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.finalizeMission = async (req, res) => {
  try {
    const { missionId, decision } = req.body;
    const mission = await Mission.findById(missionId);
    if (!mission) return res.status(404).json({ message: "Mission not found" });

    mission.status = decision === "APPROVE" ? "COMPLETED" : "IN_PROGRESS";
    await mission.save();

    res.json({ message: "Mission updated", mission });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// --- TEAMS ---
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("members leader");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

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

// --- RELIEF OPS ---
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