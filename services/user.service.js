const { db } = require("../config/firebase");

exports.createUserIfNotExists = async (uid, userData) => {
  try {
    const ref = db.collection("users").doc(uid);
    const doc = await ref.get();

    // If user doesn't exist → create document
    if (!doc.exists) {
      await ref.set({
        uid,
        email: userData.email,
        displayName: userData.displayName || null,
        photoURL: userData.photoURL || null,
        bloodType: null,
        dateOfBirth: null,
        weight: null,
        height: null,
        phone: null,
        allergies: null,
        medicalConditions: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Automatically create emergencyAccess/default document
      const emergencyAccessId = "default";
      await db.collection("users").doc(uid).collection("emergencyAccess").doc(emergencyAccessId).set({
        accessId: emergencyAccessId,
        uid,
        displayName: userData.displayName || null,
        bloodType: null,
        dateOfBirth: null,
        emergencyContacts: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log("New user created in Firestore:", uid);
      console.log("Emergency access created with ID:", emergencyAccessId);
    } else {
      console.log("User already exists:", uid);
    }

  } catch (error) {
    console.error("createUserIfNotExists Error:", error);
    throw error;
  }
};

exports.getUserById = async (uid) => {
  try {
    const ref = db.collection("users").doc(uid);
    const doc = await ref.get();

    if (doc.exists) {
      const userData = doc.data();
      
      // Get emergency access data if exists
      const emergencySnapshot = await db.collection("users").doc(uid).collection("emergencyAccess").limit(1).get();
      const emergencyData = !emergencySnapshot.empty ? {
        id: emergencySnapshot.docs[0].id,
        ...emergencySnapshot.docs[0].data()
      } : null;
      
      return {
        ...userData,
        emergencyAccess: emergencyData
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("getUserById Error:", error);
    throw error;
  }
};

exports.updateUserById = async (uid, updates) => {
  try {
    const ref = db.collection("users").doc(uid);

    const filtered = Object.entries(updates || {}).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {});

    filtered.updatedAt = new Date();

    await ref.set(filtered, { merge: true });

    // Sync profile fields to emergency access document
    const emergencyUpdateData = {};
    if (filtered.displayName !== undefined) emergencyUpdateData.displayName = filtered.displayName;
    if (filtered.bloodType !== undefined) emergencyUpdateData.bloodType = filtered.bloodType;
    if (filtered.dateOfBirth !== undefined) emergencyUpdateData.dateOfBirth = filtered.dateOfBirth;

    if (Object.keys(emergencyUpdateData).length > 0) {
      emergencyUpdateData.updatedAt = new Date();
      await db.collection("users").doc(uid).collection("emergencyAccess").doc("default").set(emergencyUpdateData, { merge: true });
    }

    return await exports.getUserById(uid);
  } catch (error) {
    console.error("updateUserById Error:", error);
    throw error;
  }
};
