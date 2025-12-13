const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const emergencyController = require("../controllers/emergency.controller");

// Generate new emergency access (protected)
router.post("/", auth, emergencyController.createAccess);

// Get emergency data by accessId (public for website)
router.get("/:uid/:accessId", emergencyController.getEmergencyData);

module.exports = router;
