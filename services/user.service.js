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
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log("New user created in Firestore:", uid);
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
