const { db } = require("../config/firebase");

exports.createPrescription = async (uid, data) => {
  const ref = db.collection("users").doc(uid).collection("prescriptions").doc();

  await ref.set({
    prescriptionId: ref.id,
    fileURL: data.fileURL,
    fileType: data.fileType,
    doctorName: data.doctorName || null,
    hospital: data.hospital || null,
    dateIssued: data.dateIssued || new Date(),
    notes: data.notes || null,
    createdAt: new Date()
  });

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
