const { db } = require("../config/firebase");

exports.createReminder = async (uid, data) => {
  const ref = db.collection("users").doc(uid).collection("reminders").doc();

  await ref.set({
    reminderId: ref.id,
    medicineName: data.medicineName,
    dosage: data.dosage,
    time: data.time,
    repeat: data.repeat,
    imageURL: data.imageURL || null,
    voiceNoteURL: data.voiceNoteURL || null,
    status: "pending",
    createdAt: new Date()
  });

  return ref.id;
};

exports.getReminders = async (uid) => {
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("reminders")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

exports.getReminder = async (uid, reminderId) => {
  const ref = db.collection("users").doc(uid).collection("reminders").doc(reminderId);
  const doc = await ref.get();

  return doc.exists ? doc.data() : null;
};

exports.updateReminder = async (uid, reminderId, data) => {
  const ref = db.collection("users").doc(uid).collection("reminders").doc(reminderId);

  await ref.update(data);
};

exports.deleteReminder = async (uid, reminderId) => {
  const ref = db.collection("users").doc(uid).collection("reminders").doc(reminderId);

  await ref.delete();
};
