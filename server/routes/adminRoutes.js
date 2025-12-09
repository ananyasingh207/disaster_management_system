const express = require("express");
const { 
  adminLogin, getVolunteers, toggleVolunteerStatus, getTeams, assignTeam,
  createCitizenAlert, createVolunteerAlert, getAlerts,
  addIncidentNote, getIncidentNotes, getAllMissions,  
  getAllUsers, deleteUser, toggleCitizenStatus,
  deployMission, getIncidentById,
  acknowledgeIncident, 
  sendCitizenReply, 
  addAdminRecord,
  getReliefRequests, finalizeMission
} = require("../controllers/adminController");

const { protect, protectAdmin } = require("../middleware/auth");

const router = express.Router();

// --- PUBLIC ---
router.post("/login", adminLogin);

// --- PROTECTED ---
router.use(protect);
router.use(protectAdmin);

// Incidents & Deployment
router.get("/incidents/:id", getIncidentById);
router.post("/deploy", deployMission);
router.post("/acknowledge", acknowledgeIncident);
router.post("/incidents/reply", sendCitizenReply);
router.post("/incidents/record", addAdminRecord);

// Incident Notes (Legacy/Optional)
router.post("/incidents/:id/notes", addIncidentNote);
router.get("/incidents/:id/notes", getIncidentNotes);

// Alerts & Feed
router.get("/alerts", getAlerts);
router.post("/alerts/citizen", createCitizenAlert);
router.post("/alerts/volunteer", createVolunteerAlert);

// Teams & Missions
router.get("/teams", getTeams);
router.get("/missions", getAllMissions);
router.post("/missions/:id/assign-team", assignTeam);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/citizens/:id/toggle-status", toggleCitizenStatus);
router.get("/volunteers", getVolunteers);
router.put("/volunteers/:id/toggle-status", toggleVolunteerStatus);

// Relief
router.get("/appeals", getReliefRequests);
router.post("/missions/finalize", finalizeMission);

module.exports = router;