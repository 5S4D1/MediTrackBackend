const { db } = require("../config/firebase");

exports.createPrescription = async (uid, data) => {
  const ref = db.collection("users").doc(uid).collection("prescriptions").doc();

  const prescriptionData = {
    prescriptionId: ref.id,
    doctorName: data.doctorName || null,
    hospital: data.hospital || null,
    dateIssued: data.dateIssued || new Date(),
    notes: data.notes || null,
    createdAt: new Date()
  };

  // Only add file-related fields if they exist
  if (data.fileURL) {
    prescriptionData.fileURL = data.fileURL;
    prescriptionData.fileType = data.fileType;
    prescriptionData.fileName = data.fileName;
    prescriptionData.publicId = data.publicId; // Cloudinary public ID for deletion
    prescriptionData.resourceType = data.resourceType; // image, video, raw, etc.
  }

  await ref.set(prescriptionData);

  return ref.id;
};

exports.getPrescriptions = async (uid) => {
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("prescriptions")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

exports.getPrescription = async (uid, prescriptionId) => {
  const ref = db.collection("users").doc(uid).collection("prescriptions").doc(prescriptionId);
  const doc = await ref.get();

  return doc.exists ? doc.data() : null;
};

exports.updatePrescription = async (uid, prescriptionId, data) => {
  const ref = db.collection("users").doc(uid).collection("prescriptions").doc(prescriptionId);

  await ref.update(data);
};

exports.deletePrescription = async (uid, prescriptionId) => {
  const ref = db.collection("users").doc(uid).collection("prescriptions").doc(prescriptionId);

  await ref.delete();
};
