const express = require("express");
const { getVolunteerAlerts } = require("../controllers/volunteerAlertController");

const router = express.Router();

router.get("/", getVolunteerAlerts);

module.exports = router;