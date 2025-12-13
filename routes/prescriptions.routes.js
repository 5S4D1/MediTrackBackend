const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const prescriptionsController = require("../controllers/prescriptions.controller");

// Create prescription
router.post("/", auth, prescriptionsController.createPrescription);

// Get all prescriptions
router.get("/", auth, prescriptionsController.getPrescriptions);

// Get single prescription
router.get("/:id", auth, prescriptionsController.getPrescriptionById);

// Update prescription
router.put("/:id", auth, prescriptionsController.updatePrescription);

// Delete prescription
router.delete("/:id", auth, prescriptionsController.deletePrescription);

module.exports = router;
