const prescriptionsService = require("../services/prescriptions.service");

exports.createPrescription = async (req, res) => {
  try {
    const uid = req.user.uid;
    const data = req.body;

    const prescriptionId = await prescriptionsService.createPrescription(uid, data);

    res.json({
      success: true,
      message: "Prescription created",
      prescriptionId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create prescription" });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const uid = req.user.uid;
    const prescriptions = await prescriptionsService.getPrescriptions(uid);

    res.json({ success: true, prescriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load prescriptions" });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;

    const prescription = await prescriptionsService.getPrescription(uid, id);

    if (!prescription) return res.status(404).json({ error: "Prescription not found" });

    res.json({ success: true, prescription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load prescription" });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;
    const data = req.body;

    await prescriptionsService.updatePrescription(uid, id, data);

    res.json({ success: true, message: "Prescription updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update prescription" });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;

    await prescriptionsService.deletePrescription(uid, id);

    res.json({ success: true, message: "Prescription deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete prescription" });
  }
};
