const express = require("express");
const {
  getVolunteerMe,
  updateVolunteer,
  getDashboardData,
  getAvailableMissions,
  acceptIncident,
  getIncident,
  resolveIncident,
  completeMission,
  submitTraining
} = require("../controllers/volunteerController");

const router = express.Router();

router.get("/me", getVolunteerMe);
router.put("/me", updateVolunteer);

router.get("/dashboard", getDashboardData); // Dashboard Feed
router.post("/training/submit", submitTraining);
router.get("/missions", getAvailableMissions); // Mission List
router.get("/incidents/:id", getIncident);
router.put("/incidents/:id/accept", acceptIncident);
router.put("/incidents/:id/resolve", resolveIncident);
router.put("/missions/:id/complete", completeMission);

module.exports = router;