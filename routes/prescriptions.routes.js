const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const prescriptionsController = require("../controllers/prescriptions.controller");
const multer = require("multer");

// Use memory storage so we can upload buffers to Firebase Storage
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Create prescription
// Accept multipart/form-data with field name 'image' for the file
router.post("/", auth, upload.single("image"), prescriptionsController.createPrescription);

// Get all prescriptions
router.get("/", auth, prescriptionsController.getPrescriptions);

// Get single prescription
router.get("/:id", auth, prescriptionsController.getPrescriptionById);

// Update prescription
router.put("/:id", auth, prescriptionsController.updatePrescription);

// Delete prescription
router.delete("/:id", auth, prescriptionsController.deletePrescription);

module.exports = router;
