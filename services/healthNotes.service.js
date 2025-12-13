const { db } = require("../config/firebase");

exports.createNote = async (uid, data) => {
  const ref = db.collection("users").doc(uid).collection("healthNotes").doc();

  await ref.set({
    noteId: ref.id,
    title: data.title,
    content: data.content,
    createdAt: new Date()
  });

  return ref.id;
};

exports.getNotes = async (uid) => {
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("healthNotes")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

exports.getNote = async (uid, noteId) => {
  const ref = db.collection("users").doc(uid).collection("healthNotes").doc(noteId);
  const doc = await ref.get();

  return doc.exists ? doc.data() : null;
};

exports.updateNote = async (uid, noteId, data) => {
  const ref = db.collection("users").doc(uid).collection("healthNotes").doc(noteId);

  await ref.update(data);
};

exports.deleteNote = async (uid, noteId) => {
  const ref = db.collection("users").doc(uid).collection("healthNotes").doc(noteId);

  await ref.delete();
};
