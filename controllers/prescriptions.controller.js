const prescriptionsService = require("../services/prescriptions.service");
const { bucket } = require("../config/firebase");

// Helper to upload a file buffer to Firebase Storage and return a signed URL
async function uploadToStorage(uid, file) {
  if (!file) return null;

  const timestamp = Date.now();
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `users/${uid}/prescriptions/${timestamp}_${safeName}`;
  const gcsFile = bucket.file(storagePath);

  await gcsFile.save(file.buffer, {
    contentType: file.mimetype,
    metadata: { contentType: file.mimetype },
  });

  // Generate a long-lived signed URL for reading (1 year)
  const [signedUrl] = await gcsFile.getSignedUrl({
    action: "read",
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });

  return { url: signedUrl, path: storagePath, type: file.mimetype, name: safeName };
}

exports.createPrescription = async (req, res) => {
  try {
    const uid = req.user.uid;
    const data = req.body || {};

    // If an image file is present, upload to Firebase Storage
    if (req.file) {
      const uploaded = await uploadToStorage(uid, req.file);
      if (uploaded) {
        data.fileURL = uploaded.url;
        data.fileType = uploaded.type;
        data.fileName = uploaded.name;
        data.storagePath = uploaded.path; // optional reference to object location
      }
    }

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

    // Get prescription to find storage path
    const prescription = await prescriptionsService.getPrescription(uid, id);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    // Delete prescription record from database
    await prescriptionsService.deletePrescription(uid, id);

    // Delete file from Firebase Storage if exists
    if (prescription.storagePath) {
      await bucket.file(prescription.storagePath).delete();
    }

    res.json({ success: true, message: "Prescription deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete prescription" });
  }
};
