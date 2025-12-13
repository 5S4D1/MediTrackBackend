const emergencyService = require("../services/emergency.service");

exports.createAccess = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { sharedData } = req.body;

    const result = await emergencyService.createEmergencyAccess(uid, sharedData);

    res.json({
      success: true,
      message: "Emergency access created",
      data: result
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create emergency access" });
  }
};

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
