const emergencyService = require("../services/emergency.service");

exports.getEmergencyData = async (req, res) => {
  try {
    const { uid, accessId } = req.params;
    const data = await emergencyService.getEmergencyData(uid, accessId);

    if (!data) return res.status(404).json({ error: "Emergency access not found" });

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch emergency data" });
  }
};

// Emergency Contacts
exports.addContact = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name, email, phone, relationship } = req.body;

    if (!name || !phone || !relationship) {
      return res.status(400).json({ error: "Name, phone, and relationship are required" });
    }

    const contacts = await emergencyService.addContact(uid, { name, email, phone, relationship });

    res.json({
      success: true,
      message: "Emergency contact added",
      contacts
    });
  } catch (error) {
    console.error("addContact error:", error);
    res.status(500).json({ error: "Failed to add emergency contact" });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const uid = req.user.uid;
    const contacts = await emergencyService.getContacts(uid);

    res.json({
      success: true,
      contacts
    });
  } catch (error) {
    console.error("getContacts error:", error);
    res.status(500).json({ error: "Failed to fetch emergency contacts" });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;
    const updates = req.body;

    const updated = await emergencyService.updateContact(uid, id, updates);

    if (!updated) {
      return res.status(404).json({ error: "Contact not found" });
    }

    res.json({
      success: true,
      message: "Emergency contact updated",
      contact: updated
    });
  } catch (error) {
    console.error("updateContact error:", error);
    res.status(500).json({ error: "Failed to update emergency contact" });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    await emergencyService.deleteContact(uid, id);

    res.json({
      success: true,
      message: "Emergency contact deleted"
    });
  } catch (error) {
    console.error("deleteContact error:", error);
    res.status(500).json({ error: "Failed to delete emergency contact" });
  }
};
