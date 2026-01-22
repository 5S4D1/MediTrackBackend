const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const emergencyController = require("../controllers/emergency.controller");

// Get emergency data by accessId (public for website)
router.get("/:uid/:accessId", emergencyController.getEmergencyData);

// Get all emergency contacts
router.get("/contacts", auth, emergencyController.getContacts);

// Create emergency contact
router.post("/contacts", auth, emergencyController.addContact);

// Update emergency contact
router.put("/contacts/:id", auth, emergencyController.updateContact);

// Delete emergency contact
router.delete("/contacts/:id", auth, emergencyController.deleteContact);

module.exports = router;
