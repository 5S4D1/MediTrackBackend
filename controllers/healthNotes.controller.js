const healthNotesService = require("../services/healthNotes.service");

exports.createNote = async (req, res) => {
  try {
    const uid = req.user.uid;
    const data = req.body;

    const noteId = await healthNotesService.createNote(uid, data);

    res.json({
      success: true,
      message: "Note created",
      noteId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create note" });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const uid = req.user.uid;
    const notes = await healthNotesService.getNotes(uid);

    res.json({ success: true, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load notes" });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;

    const note = await healthNotesService.getNote(uid, id);

    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json({ success: true, note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load note" });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;
    const data = req.body;

    await healthNotesService.updateNote(uid, id, data);

    res.json({ success: true, message: "Note updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update note" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;

    await healthNotesService.deleteNote(uid, id);

    res.json({ success: true, message: "Note deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete note" });
  }
};
