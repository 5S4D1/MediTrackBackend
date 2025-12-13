const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const remindersController = require("../controllers/reminders.controller");

// Create a reminder
router.post("/", auth, remindersController.createReminder);

// Get all reminders
router.get("/", auth, remindersController.getReminders);

// Get a single reminder
router.get("/:id", auth, remindersController.getReminderById);

// Update reminder
router.put("/:id", auth, remindersController.updateReminder);

// Delete reminder
router.delete("/:id", auth, remindersController.deleteReminder);

module.exports = router;
