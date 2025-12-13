const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const healthNotesController = require("../controllers/healthNotes.controller");

// Create a note
router.post("/", auth, healthNotesController.createNote);

// Get all notes
router.get("/", auth, healthNotesController.getNotes);

// Get single note
router.get("/:id", auth, healthNotesController.getNoteById);

// Update note
router.put("/:id", auth, healthNotesController.updateNote);

// Delete note
router.delete("/:id", auth, healthNotesController.deleteNote);

module.exports = router;
