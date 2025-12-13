const { db } = require("../config/firebase");

exports.createUserIfNotExists = async (uid, userData) => {
  try {
    const ref = db.collection("users").doc(uid);
    const doc = await ref.get();

    // If user doesn't exist → create document
    if (!doc.exists) {
      await ref.set({
        uid,
        ...userData,
        createdAt: new Date()
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
