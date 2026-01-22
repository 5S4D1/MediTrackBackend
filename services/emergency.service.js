const { db, admin } = require("../config/firebase");

const DEFAULT_ACCESS_ID = "default";

const getAccessRef = (uid) =>
  db.collection("users").doc(uid).collection("emergencyAccess").doc(DEFAULT_ACCESS_ID);

exports.createEmergencyAccess = async (uid, sharedData = [], profileData = {}) => {
  const accessRef = getAccessRef(uid);
  const accessId = DEFAULT_ACCESS_ID;

  await accessRef.set(
    {
      accessId,
      uid,
      // User profile info synced from profile
      displayName: profileData.displayName || null,
      bloodType: profileData.bloodType || null,
      dateOfBirth: profileData.dateOfBirth || null,
      // Shared data and settings
      sharedData,
      emergencyContacts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { merge: true }
  );

  // Return accessId and the URL that frontend can use to generate QR
  return {
    accessId,
    emergencyURL: `https://meditrackweb.vercel.app/emergency/${accessId}`
  };
};

exports.getEmergencyData = async (uid, accessId) => {
  const ref = getAccessRef(uid);
  const doc = await ref.get();
  return doc.exists ? doc.data() : null;
};

exports.updateEmergencyAccess = async (uid, accessId, updates) => {
  const accessRef = getAccessRef(uid);

  const filtered = Object.entries(updates || {}).reduce((acc, [key, value]) => {
    if (value !== undefined && key !== "uid" && key !== "accessId" && key !== "createdAt") {
      acc[key] = value;
    }
    return acc;
  }, {});

  filtered.updatedAt = new Date();

  await accessRef.update(filtered);

  const doc = await accessRef.get();
  return doc.exists ? doc.data() : null;
};

// Emergency Contacts stored as array inside emergencyAccess/default
exports.addContact = async (uid, contactData) => {
  const accessRef = getAccessRef(uid);
  const contactId = db.collection("_tmp").doc().id; // generate id

  // Ensure document exists and get current contacts
  const snap = await accessRef.get();
  const current = snap.exists ? snap.data().emergencyContacts || [] : [];

  const contact = {
    id: contactId,
    name: contactData.name,
    email: contactData.email || null,
    phone: contactData.phone,
    relationship: contactData.relationship,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const updatedContacts = [...current, contact];

  await accessRef.set({ emergencyContacts: updatedContacts, updatedAt: new Date() }, { merge: true });

  return updatedContacts;
};

exports.getContacts = async (uid) => {
  const accessRef = getAccessRef(uid);
  const doc = await accessRef.get();
  if (!doc.exists) return [];
  return doc.data().emergencyContacts || [];
};

exports.updateContact = async (uid, contactId, updates) => {
  const accessRef = getAccessRef(uid);
  const doc = await accessRef.get();
  if (!doc.exists) return null;

  const contacts = doc.data().emergencyContacts || [];
  const updatedContacts = contacts.map((c) => {
    if (c.id !== contactId) return c;
    return {
      ...c,
      ...updates,
      id: contactId,
      updatedAt: new Date(),
    };
  });

  await accessRef.update({ emergencyContacts: updatedContacts, updatedAt: new Date() });

  return updatedContacts.find((c) => c.id === contactId) || null;
};

exports.deleteContact = async (uid, contactId) => {
  const accessRef = getAccessRef(uid);
  const doc = await accessRef.get();
  if (!doc.exists) return;

  const contacts = doc.data().emergencyContacts || [];
  const filtered = contacts.filter((c) => c.id !== contactId);

  await accessRef.update({ emergencyContacts: filtered, updatedAt: new Date() });
};
