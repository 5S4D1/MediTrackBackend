const { db } = require("../config/firebase");

exports.createEmergencyAccess = async (uid, sharedData = []) => {
  const accessRef = db.collection("users").doc(uid).collection("emergencyAccess").doc();
  const accessId = accessRef.id;

  await accessRef.set({
    accessId,
    sharedData,
    createdAt: new Date()
  });

  // Return accessId and the URL that frontend can use to generate QR
  return {
    accessId,
    emergencyURL: `https://meditrackweb.vercel.app/emergency/${accessId}`
  };
};

exports.getEmergencyData = async (uid, accessId) => {
  const ref = db.collection("users").doc(uid).collection("emergencyAccess").doc(accessId);
  const doc = await ref.get();
  return doc.exists ? doc.data() : null;
};
