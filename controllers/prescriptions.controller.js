const prescriptionsService = require("../services/prescriptions.service");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper to upload a file buffer to Cloudinary and return the URL
async function uploadToCloudinary(uid, file) {
  if (!file) return null;

  try {
    // Upload to Cloudinary via stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `meditrack/${uid}/prescriptions`,
          resource_type: "auto", // auto-detect: image, video, raw, etc.
          public_id: `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`.replace(/\.[^.]+$/, ""), // remove extension, Cloudinary adds it
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(file.buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      type: file.mimetype,
      name: file.originalname,
      resourceType: result.resource_type
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

exports.createPrescription = async (req, res) => {
  try {
    const uid = req.user.uid;
    const data = req.body || {};

    // If a file is present, upload to Cloudinary
    if (req.file) {
      try {
        const uploaded = await uploadToCloudinary(uid, req.file);
        if (uploaded) {
          data.fileURL = uploaded.url;
          data.fileType = uploaded.type;
          data.fileName = uploaded.name;
          data.publicId = uploaded.publicId;
          data.resourceType = uploaded.resourceType;
        }
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError.message);
        // Continue without file upload - allow prescription creation with just metadata
        console.log("⚠️ Prescription will be created without file attachment");
      }
    }

    const prescriptionId = await prescriptionsService.createPrescription(uid, data);

    res.json({
      success: true,
      message: "Prescription created",
      prescriptionId,
      warning: req.file && !data.fileURL ? "File upload failed, prescription saved without attachment" : undefined
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

    // Get prescription to find public ID for deletion
    const prescription = await prescriptionsService.getPrescription(uid, id);
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    // Delete prescription record from database
    await prescriptionsService.deletePrescription(uid, id);

    // Delete file from Cloudinary if public_id exists
    if (prescription.publicId) {
      try {
        await cloudinary.uploader.destroy(prescription.publicId, { resource_type: "auto" });
        console.log(`✅ Deleted file from Cloudinary: ${prescription.publicId}`);
      } catch (deleteError) {
        console.error("Failed to delete from Cloudinary:", deleteError.message);
        // Don't fail the prescription delete if Cloudinary delete fails
      }
    }

    res.json({ success: true, message: "Prescription deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete prescription" });
  }
};
